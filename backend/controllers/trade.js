const User = require("../models/User");
const Key = require("../models/Key");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
const queue = require("../utils/queue");

const {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction: SolanaTransaction,
  LAMPORTS_PER_SOL,
  Keypair,
} = require("@solana/web3.js");

const bs58 = require("bs58");

const { getBalance, createTransfer } = require("../utils/solana");
const { decryptPrivateKey, encryptPrivateKey } = require("../utils/cipher");
const { getTradePrice } = require("../utils/price");

// const newKeyPair = Keypair.fromSecretKey(
//   new Uint8Array([
//   ])
// );

// console.log(newKeyPair);
// console.log(newKeyPair.publicKey.toBase58());
// console.log(bs58.encode(newKeyPair.secretKey));

// @route   GET api/trade/estimate/:side/:amount/:influencer
// @desc    Get estimate cost of trade
// @access  Public
const getTradeEstimate = async (req, res) => {
  try {
    const side = req.params.side;
    const amount = req.params.amount;
    const influencer = req.params.influencer;

    const { price, supply } = await getTradePrice(side, amount, influencer);

    console.log(price, supply);

    if (!price || !supply) {
      return res.status(400).send("Invalid request.");
    }

    return res.status(200).send({ price });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   POST api/trade/buy
// @desc    Create a buy trade
// @access  Private
const createBuy = async (req, res) => {
  const processBuy = async () => {
    try {
      const side = "buy";
      const amount = Number(req.body.amount);

      if (!amount || !req.body.influencer) {
        throw { status: 400, data: "Missing required fields." };
      }

      if (amount <= 0 || amount > 100) {
        throw { status: 400, data: "Invalid amount." };
      }

      const user = await User.findOne({ _id: req.session.user });
      const wallet = await Wallet.findOne({ user: user._id, chain: "solana" });
      const influencer = await User.findOne({ _id: req.body.influencer });
      const influencerWallet = await Wallet.findOne({
        user: req.body.influencer,
        chain: "solana",
      });

      if (!user || !wallet || !influencer || !influencerWallet) {
        throw { status: 404, data: "User not found" };
      }

      const { price, supply } = await getTradePrice(
        side,
        amount,
        influencer._id
      );

      const rent = 0.006 * LAMPORTS_PER_SOL;
      const fee1 = Math.ceil(price * 0.1 * 0.5 * LAMPORTS_PER_SOL + rent);
      const fee2 = Math.ceil(price * 0.1 * 0.5 * LAMPORTS_PER_SOL - rent);
      const lamPrice = Math.ceil(price * LAMPORTS_PER_SOL);

      const accountBalance = await getBalance(wallet.address);

      if (accountBalance < lamPrice + fee1 + fee2) {
        throw { status: 400, data: "Insufficient balance." };
      }

      const tx = await createTransfer(wallet, [
        {
          address: influencerWallet.address, // Fee paid to influencer
          amount: fee1,
        },
        {
          address: process.env.FEE_WALLET_ADDRESS, // Fee paid to project
          amount: fee2,
        },
        {
          address: process.env.HOT_WALLET_ADDRESS, // Project's hot wallet
          amount: lamPrice,
        },
      ]);

      if (!tx) {
        throw { status: 400, data: "Transaction failed." };
      }

      // check if buyer is already a holder in the influencer holders array
      const isHolder = influencer.holders.find(
        (holder) => holder.user.toString() === user._id.toString()
      );

      if (isHolder) {
        isHolder.quantity += Number(amount);
      } else {
        influencer.holders.push({
          user: user._id,
          quantity: amount,
        });
      }

      // check if buyer is already holding in the user jolding array
      const isHolding = user.holding.find(
        (holding) => holding.key.toString() === influencer._id.toString()
      );

      if (isHolding) {
        isHolding.quantity += Number(amount);
      } else {
        user.holding.push({
          key: influencer._id,
          quantity: amount,
        });
      }

      influencer.volume += price * LAMPORTS_PER_SOL;
      influencer.earnings += fee1;

      const transaction = new Transaction({
        user: user._id,
        influencer: influencer._id,
        type: side,
        quantity: amount,
        total: price,
        txid: tx,
      });

      influencer.price = Math.floor(
        ((supply * Math.pow(supply, 2)) / process.env.BONDED_CURVE_DIVISOR) *
          LAMPORTS_PER_SOL
      );

      await user.save();
      await wallet.save();
      await transaction.save();
      await influencer.save();

      return { status: 200, data: influencer };
    } catch (error) {
      console.log(error);
      if (error.status && error.data) {
        throw error;
      } else {
        throw { status: 500, data: "Server error" };
      }
    }
  };

  queue
    .add(processBuy)
    .then((result) => {
      res.status(result.status).send(result.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(error.status || 500).send(error.data || "Server error");
    });
};

// @route   POST api/trade/sell
// @desc    Create a sell trade
// @access  Private
const createSell = async (req, res) => {
  const processSell = async () => {
    try {
      const side = "sell";
      const amount = req.body.amount;

      if (!amount || !req.body.influencer) {
        throw { status: 400, data: "Missing required fields." };
      }

      if (amount <= 0 || amount > 100) {
        throw { status: 400, data: "Invalid amount." };
      }

      const user = await User.findOne({ _id: req.session.user });
      const wallet = await Wallet.findOne({ user: user._id, chain: "solana" });
      const influencer = await User.findOne({ _id: req.body.influencer });
      const influencerWallet = await Wallet.findOne({
        user: req.body.influencer,
        chain: "solana",
      });

      if (!user || !wallet || !influencer || !influencerWallet) {
        throw { status: 404, data: "User not found" };
      }

      const { price, supply } = await getTradePrice(
        side,
        amount,
        influencer._id
      );
      const rent = 0.006 * LAMPORTS_PER_SOL;
      const fee1 = Math.ceil(price * 0.1 * 0.5 * LAMPORTS_PER_SOL + rent);
      const fee2 = Math.ceil(price * 0.1 * 0.5 * LAMPORTS_PER_SOL - rent);
      const feeTotal = fee1 + fee2;
      const lamPrice = Math.ceil(price * LAMPORTS_PER_SOL - feeTotal);

      const keysOwned = influencer.holders.find((holder) => {
        return holder.user.toString() === user._id.toString();
      }).quantity;

      if (!keysOwned || keysOwned < amount) {
        throw { status: 400, data: "Insufficient balance." };
      }

      console.log(keysOwned, amount);

      const from = {
        address: process.env.HOT_WALLET_ADDRESS,
        privateKey: process.env.HOT_WALLET_SECRET,
      };

      const tx = await createTransfer(from, [
        {
          address: influencerWallet.address, // Fee paid to influencer
          amount: fee1,
        },
        {
          address: process.env.FEE_WALLET_ADDRESS, // Fee paid to project
          amount: fee2,
        },
        {
          address: wallet.address, // Sellers wallet
          amount: lamPrice,
        },
      ]);

      if (!tx) {
        throw { status: 400, data: "Transaction failed." };
      }

      const holder = influencer.holders.find(
        (holder) => holder.user.toString() === user._id.toString()
      );

      holder.quantity -= Number(amount);

      const holding = user.holding.find(
        (holding) => holding.key.toString() === influencer._id.toString()
      );

      holding.quantity -= Number(amount);

      influencer.volume += price * LAMPORTS_PER_SOL;
      influencer.earnings += fee1;

      const transaction = new Transaction({
        user: user._id,
        influencer: influencer._id,
        type: side,
        quantity: amount,
        total: price,
        txid: tx,
      });

      influencer.price = Math.floor(
        ((supply * Math.pow(supply, 2)) / process.env.BONDED_CURVE_DIVISOR) *
          LAMPORTS_PER_SOL
      );

      await user.save();
      await wallet.save();
      await transaction.save();
      await influencer.save();

      return { status: 200, data: influencer };
    } catch (error) {
      console.log(error);
      throw { status: 500, data: "Server error" };
    }
  };

  queue
    .add(processSell)
    .then((result) => {
      res.status(result.status).send(result.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(error.status || 500).send(error.data || "Server error");
    });
};

// @route   GET api/trade
// @desc    Get all trades for a user
// @access  Private
const getTrades = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   GET api/trade/:id
// @desc    Get trade by id
// @access  Private
const getTradeById = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   PUT api/trade/:id
// @desc    Update trade by id
// @access  Private
const updateTradeById = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   DELETE api/trade/:id
// @desc    Delete trade by id
// @access  Private
const deleteTradeById = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  createBuy,
  getTrades,
  getTradeById,
  updateTradeById,
  deleteTradeById,
  getTradeEstimate,
  createSell,
};
