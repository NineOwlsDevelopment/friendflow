const User = require("../models/User");
const Key = require("../models/Key");
const Wallet = require("../models/Wallet");
const {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  Keypair,
} = require("@solana/web3.js");
const bs58 = require("bs58");
const { getBalance } = require("../utils/solana");
const { decryptPrivateKey } = require("../utils/cipher");

// @route   POST api/key
// @desc    Create a key
// @access  Private
const createKey = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   GET api/key
// @desc    Get all keys for a user
// @access  Private
const getKeys = async (req, res) => {
  try {
    const currentUser = req.session.user;

    const user = await User.findOne({ _id: currentUser });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const keys = await Key.find({ holder: currentUser });

    if (!keys) {
      return res.status(404).send("Keys not found");
    }

    return res.status(200).send(keys);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   GET api/key/:id
// @desc    Get key by id
// @access  Private
const getKeyById = async (req, res) => {
  try {
    const currentUser = req.session.user;

    const user = await User.findOne({ _id: currentUser });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const key = await Key.findOne({ _id: req.params.id });

    if (!key) {
      return res.status(404).send("Key not found");
    }

    if (key.holder !== currentUser) {
      return res.status(401).send("Unauthorized");
    }

    return res.status(200).send(key);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   DELETE api/key/:id
// @desc    Delete a key
// @access  Private
const deleteKey = async (req, res) => {
  try {
    const currentUser = req.session.user;

    const user = await User.findOne({ _id: currentUser });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const key = await Key.findOne({ _id: req.params.id });

    if (!key) {
      return res.status(404).send("Key not found");
    }

    if (key.holder !== currentUser) {
      return res.status(401).send("Unauthorized");
    }

    await Key.deleteOne({ _id: req.params.id });

    return res.status(200).send("Key deleted");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  createKey,
  getKeys,
  getKeyById,
  deleteKey,
};
