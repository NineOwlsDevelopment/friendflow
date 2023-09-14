const express = require("express");
const authController = require("../controllers/auth.js");

const router = express.Router();

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post("/login", authController.loginUser);

module.exports = router;
