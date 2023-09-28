const express = require("express");
const walletController = require("../controllers/wallet.js");

const router = express.Router();

// @route   POST api/wallet
// @desc    Create a wallet
// @access  Private
router.post("/", walletController.createWallet);

// @route   GET api/wallet/
// @desc    Get current user wallet
// @access  Private
router.get("/", walletController.getWallet);

// @route   GET api/wallet/export
// @desc    Get private key
// @access  Private
router.get("/export", walletController.getPrivateKey);

// @route   POST api/wallet/withdraw
// @desc    Withdraw from wallet
// @access  Private
router.post("/withdraw", walletController.withdraw);

module.exports = router;
