const User = require("../models/User");
const Room = require("../models/Room");
const Session = require("../models/Session");
const Key = require("../models/Key");
const Wallet = require("../models/Wallet");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
// const { TwitterApi } = require("twitter-api-v2");
const axios = require("axios");

const { PublicKey, Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const { v4: uuidv4 } = require("uuid");

const { generateKeypair } = require("../utils/cipher");
const { getBalance } = require("../utils/solana");
const { getTradePrice } = require("../utils/price");
const { populate } = require("../models/Fee");

// const consumerKey = process.env.TWITTER_API_CONSUMER_KEY;
// const consumerSecret = process.env.TWITTER_API_CONSUMER_SECRET;

// const accessToken = process.env.TWITTER_API_ACCESS_TOKEN;
// const accessTokenSecret = process.env.TWITTER_API_ACCESS_TOKEN_SECRET;

// const clientId = process.env.TWITTER_API_CLIENT_ID;
// const clientSecret = process.env.TWITTER_API_CLIENT_SECRET;

// @route   Post /api/user
// @desc    Manually add a user
// @access  Private
const createUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const passcode = process.env.PASSCODE;

    if (req.body.passcode !== passcode) {
      return res.status(401).send("Unauthorized");
    }

    const user = new User({
      twitterId: req.body.twitterId,
      username: req.body.username.toLowerCase(),
      displayName: req.body.displayName,
      email: req.body.email,
      avatar: req.body.avatar,
      followers: req.body.followers,
      claimed: false,
      price: 62500,
      points: 10,
      minimumKeys: 1,
      minKeysLastUpdated: Date.now(),
      rank: "bronze",
    });

    const room = new Room({
      _id: uuidv4(),
      name: req.body.username.toLowerCase(),
      owner: user._id,
    });

    const createWallet = await generateKeypair();

    const wallet = new Wallet({
      user: user._id,
      address: createWallet.publicKey,
      privateKey: createWallet.encryptedPrivateKey,
      chain: "solana",
      balance: 0,
    });

    await wallet.save({ session });
    await room.save({ session });
    await user.save({ session });

    // If all operations are successful, commit the transaction
    await session.commitTransaction();
    session.endSession();

    if (!room || !user || !wallet) {
      return res.status(401).send("There was an error creating your account.");
    }

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send("Server error");
  }
};

// @route   GET /api/user/search/:username
// @desc    Search users by username
// @access  Public
const searchUsers = async (req, res) => {
  try {
    let query = {};

    if (req.params.username !== "null" && req.params.username !== null) {
      query.username = { $regex: req.params.username, $options: "i" };
    }

    const users = await User.find(query).sort({ volume: -1 }).limit(50);

    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   GET /api/user/friends
// @desc    Get friends
// @access  Private
const getFriends = async (req, res) => {
  try {
    const { friends, totalValue } = await User.getFriends(req.session.user);

    return res.status(200).send({ friends, totalValue });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   GET /api/user/:id
// @desc    Get user by id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.getUser(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   GET /api/user
// @desc    Get logged in user
// @access  Private
const getcurrentUser = async (req, res) => {
  try {
    const user = await User.getUser(req.session.user);

    if (!user) {
      return res.status(511).send("User not found");
    }

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   GET /api/user/top
// @desc    Get logged in user
// @access  Private
const getTopUsers = async (req, res) => {
  try {
    const users = await User.getTopUsers();

    if (!users) {
      return res.status(404).send("Users not found.");
    }

    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   PUT /api/user/
// @desc    Update user
// @access  Private
const updateUser = async (req, res) => {
  try {
    const user = await User.getUser(req.session.user);

    if (!user) {
      return res.status(511).send("User not found");
    }

    const query = {};

    if (req.body.minimumKeys) {
      let minimumKeys = Number(req.body.minimumKeys);

      if (minimumKeys < 0) {
        return res.status(401).send("Minimum amount can not be less than 0.");
      }

      const timeSinceLastUpdate = Date.now() - user.minKeysLastUpdated;

      if (timeSinceLastUpdate < 24 * 60 * 60 * 1000) {
        return res
          .status(401)
          .send("You may only update minimum key amounts once per day.");
      }

      query.minimumKeys = minimumKeys;
      query.minKeysLastUpdated = Date.now();
    }

    if (req.body.tradelock) {
      query.tradelock = req.body.tradelock;
    }

    await User.updateOne({ _id: user._id }, { $set: query });

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  createUser,
  getcurrentUser,
  getUserById,
  getTopUsers,
  searchUsers,
  updateUser,
  getFriends,
};
