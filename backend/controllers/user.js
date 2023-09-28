const User = require("../models/User");
const Room = require("../models/Room");
const Session = require("../models/Session");
const Key = require("../models/Key");
const Wallet = require("../models/Wallet");
const mongoose = require("mongoose");

const { PublicKey, Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const { v4: uuidv4 } = require("uuid");

const { generateKeypair } = require("../utils/cipher");
const { getBalance } = require("../utils/solana");
const { getPortfolioValue } = require("../utils/price");

// const migrateUsers = async (req, res) => {
//   try {
//     await User.updateMany({}, { $set: { minimumKeys: 1 } });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const migrateUsers = async (req, res) => {
//   try {
//     await User.updateMany(
//       { minKeysLastUpdated: { $exists: false } },
//       { $set: { minKeysLastUpdated: Date.now() - 24 * 60 * 60 * 1000 } }
//     );
//     console.log("done");
//   } catch (error) {
//     console.log(error);
//   }
// };

// const updateKeyQuantities = async (req, res) => {
//   try {
//     const keys = await Key.find({});

//     await User.updateMany(
//       { minKeysLastUpdated: { $exists: false } },
//       { $set: { minKeysLastUpdated: Date.now() - 24 * 60 * 60 * 1000 } }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// const valuator = (amountToBuy) => {
//   for (let i = 0; i < amountToBuy; i++) {
//     const price =
//       (supply * Math.pow(supply, 2)) / process.env.BONDED_CURVE_DIVISOR;
//     supply++;
//     console.log(price);
//   }
// };

// const updatePriceForAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({});

//     users.map(async (user) => {
//       const key = await Key.find({ influencer: user._id });

//       const quantity = key.reduce((a, b) => a + b.quantity, 0);

//       const price =
//         ((quantity * Math.pow(quantity, 2)) /
//           process.env.BONDED_CURVE_DIVISOR) *
//         LAMPORTS_PER_SOL;

//       await User.updateOne(
//         { _id: user._id },
//         { $set: { price: price * LAMPORTS_PER_SOL } }
//       );

//       console.log(user.username, quantity, price * LAMPORTS_PER_SOL);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// updatePriceForAllUsers();

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

    user.price = Math.floor(
      ((1 * Math.pow(1, 2)) / process.env.BONDED_CURVE_DIVISOR) *
        LAMPORTS_PER_SOL
    );

    user.holders = [
      {
        user: user._id,
        quantity: 1,
      },
    ];

    user.holding = [
      {
        key: user._id,
        quantity: 1,
      },
    ];

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

    const users = await User.find(query).sort({ volume: -1 }).limit(20);

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
    const user = await User.findOne({ _id: req.session.user }).populate(
      "holding.key"
    );

    // remove user from friends list
    const friends = user.holding.filter((friend) => {
      return friend.key.username !== user.username;
    });

    // get total value of portfolio
    const totalValue = friends.reduce((acc, friend) => {
      return acc + friend.quantity * friend.key.price;
    }, 0);

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
    const user = await User.findOne({
      $or: [{ _id: req.params.id }, { username: req.params.id }],
    });

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
    const currentUser = req.session.user;

    const user = await User.findOne({ _id: currentUser });

    if (!user) {
      return res.status(404).send("User not found");
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
    const users = await User.find({}).sort({ volume: -1 }).limit(20);

    res.json(users);
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
    const currentUser = req.session.user;

    const user = await User.findOne({ _id: currentUser }).select("-privateKey");

    if (!user) {
      return res.status(404).send("User not found");
    }

    const query = {};

    if (req.body.minimumKeys) {
      if (req.body.minimumKeys < 0) {
        return res.status(401).send("Minimum amount can not be less than 0.");
      }

      const timeSinceLastUpdate = Date.now() - user.minKeysLastUpdated;

      if (timeSinceLastUpdate < 24 * 60 * 60 * 1000) {
        return res
          .status(401)
          .send("You may only update minimum key amounts once per day.");
      }

      query.minimumKeys = req.body.minimumKeys;

      query.minKeysLastUpdated = Date.now();
    }

    await User.updateOne({ _id: currentUser }, { $set: query });

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
