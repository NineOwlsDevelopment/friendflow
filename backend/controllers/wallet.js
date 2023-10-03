const Wallet = require("../models/Wallet");
const User = require("../models/User");
const {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  Keypair,
} = require("@solana/web3.js");
const bs58 = require("bs58");
const mongoose = require("mongoose");

const { getCoinPrice } = require("../utils/price");
const { getBalance } = require("../utils/solana");
const { decryptPrivateKey, encryptPrivateKey } = require("../utils/cipher");
const queue = require("../utils/queue");

// const newKeyPair = () => {
//   const keypair = Keypair.generate();
//   const privateKey = bs58.encode(keypair.secretKey);
//   const publicKey = keypair.publicKey.toBase58();

//   const encryptedKey = encryptPrivateKey(privateKey);

//   return {
//     encryptedKey,
//     privateKey,
//     publicKey,
//   };
// };

// console.log(newKeyPair());

const Withdrawal = require("../models/Withdrawal");

// @route   POST api/wallet
// @desc    Create a wallet
// @access  Private
const createWallet = async (req, res) => {
  try {
    const passcode = req.body.passcode;

    if (passcode !== process.env.PASSCODE) {
      return res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   GET api/wallet/
// @desc    Get current user wallet
// @access  Private
const getWallet = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.session.user });

    if (!user) {
      return res.status(511).send("User not found");
    }

    const wallet = await Wallet.findByUser(user._id);

    return res.status(200).send(wallet);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   POST api/wallet/withdraw
// @desc    Withdraw from wallet
// @access  Private
const withdraw = async (req, res) => {
  const processWithdrawal = async () => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.getUser(req.session.user);
      if (!user) throw { status: 511, data: "User not found." };

      const wallet = await Wallet.findByUser(user._id);
      if (!wallet) throw { status: 511, data: "User not found." };

      let amount = Math.floor(Number(req.body.amount) * LAMPORTS_PER_SOL);
      let address = req.body.address;

      if (!amount || !address) {
        throw { status: 400, data: "Please enter all fields." };
      }

      if (amount / LAMPORTS_PER_SOL < 0.01) {
        throw { status: 400, data: "Invalid amount." };
      }
      if (isNaN(amount)) throw { status: 400, data: "Invalid amount." };
      if (wallet.balance < amount) {
        throw { status: 400, data: "Insufficient balance." };
      }

      const pk = decryptPrivateKey(process.env.HOT_WALLET_SECRET);
      const privateKey = Keypair.fromSecretKey(new Uint8Array(bs58.decode(pk)));

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(process.env.HOT_WALLET_ADDRESS),
          toPubkey: new PublicKey(address),
          lamports: Number(amount) - 5000,
        })
      );

      const connection = new Connection(process.env.SOLANA_RPC);
      const { blockhash } = await connection.getRecentBlockhash();

      transaction.recentBlockhash = blockhash;
      transaction.sign(privateKey);
      const rawTransaction = transaction.serialize();

      const signature = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 5,
      });

      wallet.balance = Number(wallet.balance) - amount;
      await wallet.save({ session });

      const withdrawal = new Withdrawal({
        user: user._id,
        amount: amount,
        address: address,
        txid: signature,
      });

      await withdrawal.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        status: 200,
        data: {
          signature,
          wallet,
        },
      };
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
      return res.status(500).send("Server error");
    }
  };

  queue
    .add(processWithdrawal)
    .then((result) => {
      res.status(result.status).send(result.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(error.status || 500).send(error.data || "Server error");
    });
};

const getPrivateKey = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.session.user });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const wallet = await Wallet.findOne({ user: user._id });

    if (!wallet) {
      return res.status(404).send("Wallet not found");
    }

    const pk = decryptPrivateKey(wallet.privateKey);

    return res.status(200).send(pk);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  createWallet,
  getWallet,
  withdraw,
  getPrivateKey,
};
