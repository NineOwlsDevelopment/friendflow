const express = require("express");
const authController = require("../controllers/auth.js");

const router = express.Router();

// // @route POST api/auth/login
// // @desc Login user
// // @access Public
// router.post("/login", authController.loginUser);

// @route GET api/auth/twitter-login
// @desc Login user with Twitter
// @access Public
router.get("/twitter-login", authController.twitterLogin);

// @route GET api/auth/twitter-callback
// @desc Login user with Twitter
// @access Public
router.post("/twitter-callback", authController.twitterCallback);

// @route POST api/auth/logout
// @desc Logout user
// @access Public
router.post("/logout", authController.logoutUser);

module.exports = router;
