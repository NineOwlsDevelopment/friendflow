const User = require("../models/User");
const Key = require("../models/Key");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
const Fee = require("../models/Fee");
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
const { getTradePrice, getPrice } = require("../utils/price");

const setFee = async (amount) => {
  try {
    const fee = await Fee.findOne({});

    if (!fee) {
      console.log("No fee found");
      return;
    }

    fee.total += amount;

    await fee.save();
    return fee;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// @route   GET api/trade/estimate/:side/:amount/:influencer
// @desc    Get estimate cost of trade
// @access  Public
const getTradeEstimate = async (req, res) => {
  try {
    const side = req.params.side;
    const amount = req.params.amount;
    const influencer = req.params.influencer;

    let price = await getTradePrice(side, amount, influencer);

    if (price <= 0 || isNaN(price)) {
      price = 0;
    }

    return res.status(200).send({ price: price });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   POST api/trade/buy
// @desc    Create a buy trade
// @access  Private
const createBuy = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const processBuy = async () => {
    try {
      const side = "buy";
      const amount = Number(req.body.amount);

      if (!amount || !req.body.influencer) {
        throw { status: 400, data: "Missing required fields." };
      }

      if (amount < 0.001 || amount > 100) {
        throw { status: 400, data: "Amount must be between 0.001 and 100." };
      }

      if (isNaN(amount)) throw { status: 400, data: "Invalid amount." };

      const user = await User.getUser(req.session.user);
      if (!user) throw { status: 511, data: "User not found" };

      const wallet = await Wallet.findByUser(user._id);
      if (!wallet) throw { status: 511, data: "Wallet not found" };

      const influencer = await User.getUser(req.body.influencer);
      if (!influencer) throw { status: 404, data: "Influencer not found" };

      const influencerWallet = await Wallet.findByUser(influencer._id);
      if (!influencerWallet) throw { status: 404, data: "Wallet 2 not found" };

      const price = Number(await getTradePrice(side, amount, influencer._id));
      const fee1 = Math.ceil(price * 0.1 * 0.5); // 10% of price, 50% to influencer
      const fee2 = Math.ceil(price * 0.1 * 0.5); // 10% of price, 50% to platform
      const total = Number(price + fee1 + fee2);

      // console.log(total);
      // console.log(price, fee1, fee2);
      // console.log(wallet.balance, fee1, fee2);
      // console.log(user._id, influencer._id);

      if (wallet.balance < total) {
        throw { status: 400, data: "Insufficient balance." };
      }

      // check if buyer is already a holder in the influencer holders array
      const isHolder = influencer.holders.find(
        (holder) => holder.user.toString() === user._id.toString()
      );

      const isHolding = user.holding.find(
        (holding) => holding.user.toString() === influencer._id.toString()
      );

      // if buyer is already a holder, add to their quantity else add them to the holders array
      if (isHolder) {
        isHolder.quantity += Number(amount);
      } else {
        influencer.holders.push({
          user: user._id,
          quantity: amount,
        });
      }

      if (isHolding) {
        isHolding.quantity += Number(amount);
      } else {
        user.holding.push({
          user: influencer._id,
          quantity: amount,
        });
      }

      influencer.volume += Number(price);

      if (wallet.user.toString() === influencerWallet.user.toString()) {
        wallet.balance -= Number(price);

        // update user points only when buying from self
        user.points = Number(user.points + amount * 2).toFixed(3);
      } else {
        wallet.balance -= Number(total);
        influencerWallet.balance += Number(fee1);
        influencer.earnings += Number(fee1);

        // update user points and influencer points if they are not the same user
        user.points = Number(user.points + amount * 2).toFixed(3);
        influencer.points = Number(influencer.points + amount * 2).toFixed(3);
      }

      const transaction = new Transaction({
        user: user._id,
        influencer: influencer._id,
        type: side,
        quantity: amount,
        total: price,
      });

      const circulating = influencer.holders.reduce((acc, holder) => {
        return acc + holder.quantity;
      }, 0);

      influencer.price = getPrice(Number(circulating) + 1, 1);

      await setFee(fee2);

      await user.save({ session });
      await wallet.save({ session });
      await transaction.save({ session });
      await influencer.save({ session });
      await influencerWallet.save({ session });

      await session.commitTransaction();
      session.endSession();

      return { status: 200, data: influencer };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      throw { status: 500, data: "Server error" };
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
  const session = await mongoose.startSession();
  session.startTransaction();

  const processSell = async () => {
    try {
      const side = "sell";
      const amount = Number(req.body.amount);

      if (!amount || !req.body.influencer) {
        throw { status: 400, data: "Missing required fields." };
      }

      if (amount < 0.001 || amount > 100) {
        throw { status: 400, data: "Amount must be between 0.001 and 100." };
      }

      if (isNaN(amount)) throw { status: 400, data: "Invalid amount." };

      const user = await User.getUser(req.session.user);
      if (!user) throw { status: 511, data: "User not found" };

      const wallet = await Wallet.findByUser(user._id);
      if (!wallet) throw { status: 511, data: "Wallet not found" };

      const influencer = await User.getUser(req.body.influencer);
      if (!influencer) throw { status: 404, data: "Influencer not found" };

      const influencerWallet = await Wallet.findByUser(influencer._id);
      if (!influencerWallet) throw { status: 404, data: "Wallet 2 not found" };

      const price = Number(await getTradePrice(side, amount, influencer._id));
      const fee1 = Math.ceil(price * 0.1 * 0.5); // 10% of price, 50% to influencer
      const fee2 = Math.ceil(price * 0.1 * 0.5); // 10% of price, 50% to platform
      const total = Number(price - fee1 - fee2);

      const keysOwned = influencer.holders.find((holder) => {
        return holder.user.toString() === user._id.toString();
      }).quantity;

      if (!keysOwned || keysOwned < amount) {
        throw { status: 400, data: "Insufficient balance." };
      }

      const holder = influencer.holders.find(
        (holder) => holder.user.toString() === user._id.toString()
      );

      const holding = user.holding.find(
        (holding) => holding.user.toString() === influencer._id.toString()
      );

      if (!holder || !holding) {
        throw { status: 400, data: "Insufficient balance." };
      }

      holder.quantity -= Number(amount);
      holding.quantity -= Number(amount);
      influencer.volume += price;

      if (wallet.user.toString() === influencerWallet.user.toString()) {
        wallet.balance += total;
      } else {
        wallet.balance += total;
        influencerWallet.balance += fee1;
        influencer.earnings += fee1;
      }

      const transaction = new Transaction({
        user: user._id,
        influencer: influencer._id,
        type: side,
        quantity: amount,
        total: price,
      });

      const circulating = influencer.holders.reduce((acc, holder) => {
        return acc + holder.quantity;
      }, 0);

      influencer.price = getPrice(Number(circulating + 1), 1);

      // if holder quantity is 0, remove from holders array
      if (holder.quantity === 0) {
        influencer.holders = influencer.holders.filter((holder) => {
          return holder.user.toString() !== user._id.toString();
        });
      }

      // if holding quantity is 0, remove from holding array
      if (holding.quantity === 0) {
        user.holding = user.holding.filter((holding) => {
          return holding.user.toString() !== influencer._id.toString();
        });
      }

      await setFee(fee2);

      await user.save({ session });
      await wallet.save({ session });
      await transaction.save({ session });
      await influencer.save({ session });
      await influencerWallet.save({ session });

      await session.commitTransaction();
      session.endSession();

      return { status: 200, data: influencer };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
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
