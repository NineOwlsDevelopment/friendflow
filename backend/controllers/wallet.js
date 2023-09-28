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
const { getCoinPrice } = require("../utils/price");
const { getBalance } = require("../utils/solana");
const { decryptPrivateKey } = require("../utils/cipher");

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

// @route   GET api/wallet
// @desc    Get all wallets
// @access  Private
const getWallets = async (req, res) => {
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
    const currentUser = req.session.user;

    const user = await User.findOne({ _id: currentUser });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const wallet = await Wallet.findOne({ user: user._id }).select(
      "-privateKey"
    );

    if (!wallet) {
      return res.status(404).send("Wallet not found");
    }

    const balance = await getBalance(wallet.address);

    wallet.balance = balance;

    await wallet.save();

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
  try {
    const currentUser = req.session.user;

    const user = await User.findOne({ _id: currentUser });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const wallet = await Wallet.findOne({ user: user._id });

    if (!wallet) {
      return res.status(404).send("Wallet not found");
    }

    const { amount, address } = req.body;

    if (!amount || !address) {
      return res.status(400).send("Please enter all fields");
    }

    if (amount <= 0) {
      return res.status(400).send("Invalid amount");
    }

    if (isNaN(amount)) {
      throw { status: 400, data: "Invalid amount." };
    }

    const balance = await getBalance(wallet.address);

    if (balance < amount) {
      return res.status(400).send("Insufficient balance");
    }

    const pk = decryptPrivateKey(wallet.privateKey);

    const privateKey = Keypair.fromSecretKey(new Uint8Array(bs58.decode(pk)));

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet.address),
        toPubkey: address,
        lamports: Number(amount * LAMPORTS_PER_SOL),
      })
    );

    const connection = new Connection(process.env.SOLANA_RPC);

    const { blockhash } = await connection.getRecentBlockhash();

    transaction.recentBlockhash = blockhash;
    transaction.sign(privateKey);
    const rawTransaction = transaction.serialize();

    const signature = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: false,
    });

    console.log(signature);

    wallet.balance = balance - amount;

    await wallet.save();

    // remove private key from response
    wallet.privateKey = undefined;

    return res.status(200).send({
      signature,
      wallet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route  GET api/wallet/export
// @desc   Get private key
// @access Private
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
  getWallets,
  getWallet,
  withdraw,
  getPrivateKey,
};
