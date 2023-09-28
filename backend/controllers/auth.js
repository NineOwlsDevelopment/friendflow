const express = require("express");
const User = require("../models/User");
const Room = require("../models/Room");
const Session = require("../models/Session");
const Key = require("../models/Key");
const Wallet = require("../models/Wallet");

const { PublicKey, Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const { v4: uuidv4 } = require("uuid");
const nacl = require("tweetnacl");
const bs58 = require("bs58");

const OAuth = require("oauth"),
  qs = require("querystring");
const { TwitterApi } = require("twitter-api-v2");
const Auth = OAuth.OAuth;

const { generateKeypair } = require("../utils/cipher");
const { getBalance } = require("../utils/solana");

const mongoose = require("mongoose");

const consumerKey = process.env.TWITTER_API_CONSUMER_KEY;
const consumerSecret = process.env.TWITTER_API_CONSUMER_SECRET;

const accessToken = process.env.TWITTER_API_ACCESS_TOKEN;
const accessTokenSecret = process.env.TWITTER_API_ACCESS_TOKEN_SECRET;

const clientId = process.env.TWITTER_API_CLIENT_ID;
const clientSecret = process.env.TWITTER_API_CLIENT_SECRET;

const requestUrl = "https://twitter.com/oauth/request_token";
const accessUrl = "https://twitter.com/oauth/access_token";
const authorizeUrl = "https://twitter.com/oauth/authorize";

const oa = new Auth(
  requestUrl,
  accessUrl,
  consumerKey,
  consumerSecret,
  "2.0",
  null,
  "HMAC-SHA1"
);

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

// @route   GET api/auth/twitter-login
// @desc    login with twitter
// @access  Public
const twitterLogin = async (req, res) => {
  try {
    oa.getOAuthRequestToken((e, requestToken) => {
      if (e) {
        console.error(e);
        return res.status(500).send("Server error");
      }

      const authUrl =
        authorizeUrl + "?" + qs.stringify({ oauth_token: requestToken });

      console.log(authUrl);
      return res.send(authUrl);
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

// @route   POST api/auth/twitter-callback
// @desc    login with twitter
// @access  Public
const twitterCallback = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { oauth_token, oauth_verifier } = req.body;
    // const { requestToken, requestTokenSecret } = req.session;

    const handleGetOAuthAccessToken = async (e, userToken, userSecret) => {
      try {
        if (e) {
          console.error(e);
          return res.status(500).send("Server error");
        }

        // Login using app key and secret and verify using the users access and secret token
        const twitterClient = new TwitterApi({
          appKey: consumerKey,
          appSecret: consumerSecret,
          accessToken: userToken,
          accessSecret: userSecret,
        });

        if (!twitterClient) {
          return res.status(401).send("Invalid Twitter credentials.");
        }

        // Returns the users twitter name and ID
        const twitterAccount = await twitterClient.v1.verifyCredentials({
          include_email: true,
          include_entities: false,
          skip_status: true,
        });

        console.log(twitterAccount);

        let user = await User.findOne({
          twitterId: twitterAccount.id_str,
        }).select("-email");

        if (user) {
          user.username = twitterAccount.screen_name.toLowerCase();
          user.displayName = twitterAccount.name;
          user.avatar = twitterAccount.profile_image_url_https;
        }

        if (user && !user.claimed) {
          user.claimed = true;
        }

        let wallet = await Wallet.findOne({
          user: user?._id,
        }).select("-privateKey");

        if (!user) {
          user = new User({
            twitterId: twitterAccount.id_str,
            username: twitterAccount.screen_name.toLowerCase(),
            displayName: twitterAccount.name,
            email: twitterAccount.email,
            avatar: twitterAccount.profile_image_url_https,
            minimumKeys: 1,
            claimed: true,
          });

          const createWallet = generateKeypair();

          wallet = new Wallet({
            user: user._id,
            address: createWallet.publicKey,
            privateKey: createWallet.encryptedPrivateKey,
            chain: "solana",
            balance: 0,
          });

          const room = new Room({
            name: user.username,
            owner: user._id,
            users: [user._id],
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

          if (!room || !user || !wallet) {
            return res
              .status(401)
              .send("There was an error creating your account.");
          }
        }

        wallet.balance = await getBalance(wallet.address);
        user.followers = twitterAccount.followers_count;
        user.following = twitterAccount.friends_count;
        await user.save({ session });
        await wallet.save({ session });

        req.session._id = uuidv4();
        req.session.user = user._id;

        req.session.cookie._id = uuidv4();
        req.session.cookie.user = user._id;

        // If all operations are successful, commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).send({
          user,
          wallet,
        });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        return res.status(500).send("Server error");
      }
    };

    try {
      oa.getOAuthAccessToken(
        oauth_token,
        oauth_token,
        oauth_verifier,
        handleGetOAuthAccessToken
      );
    } catch (e) {
      console.log(e);
      return res.status(400).send({ error: e.message });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   POST api/auth/logout
// @desc    logout user
// @access  Public
const logoutUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.session.user });

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    await req.session.destroy();

    res.clearCookie("connect.sid");

    return res.status(200).send("Logout successful");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  twitterLogin,
  twitterCallback,
  loginUser,
  logoutUser,
};
