const express = require("express");
const User = require("../models/User");
const Session = require("../models/Session");
const { PublicKey } = require("@solana/web3.js");
const { v4: uuidv4 } = require("uuid");
const nacl = require("tweetnacl");
const bs58 = require("bs58");

// @route   POST api/auth/login
// @desc    Get all users
// @access  Public
const loginUser = async (req, res) => {
  try {
    const pk = new PublicKey(req.body.publicKey);

    const signature = req.body.signature.data
      ? new Uint8Array(req.body.signature.data)
      : new Uint8Array(Object.values(req.body.signature));

    const uInt8Message = new TextEncoder().encode(
      `Login as ${req.body.publicKey}`
    );

    const pkUint8 = bs58.decode(pk.toString());

    const isVerified = nacl.sign.detached.verify(
      uInt8Message,
      signature,
      pkUint8
    );

    if (!isVerified) {
      return res.status(401).send("Unauthorized");
    }

    let user = await User.findOne({ publicKey: req.body.publicKey });

    if (!user) {
      user = new User({
        username: req.body.publicKey,
        solanaAddress: req.body.publicKey,
      });

      await user.save();
    }

    const session = new Session({
      _id: uuidv4(),
      user: user._id,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });

    await session.save();

    req.session.sessionId = session._id;
    req.session.user = user._id;

    return res.send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  loginUser,
};
