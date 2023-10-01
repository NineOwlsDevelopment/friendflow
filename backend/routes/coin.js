const express = require("express");
const coinController = require("../controllers/coin.js");

const router = express.Router();

// @route   POST api/coin
// @desc    Create a coin
// @access  Private
// router.post("/", coinController.createCoin);

// @route   GET api/coin
// @desc    Get all coins
// @access  Public
router.get("/", coinController.getCoins);

// @route   GET api/coin/:symbol
// @desc    Get a coin
// @access  Public
router.get("/:symbol", coinController.getCoinBySymbol);

// @route   Put /api/coin/:symbol
// @desc    Update coin by symbol
// @access  Private
// router.put("/:symbol", coinController.updateCoinBySymbol);

// @route   Delete /api/coin/:symbol
// @desc    Delete coin by symbol
// @access  Private
// router.delete("/:symbol", coinController.deleteCoinBySymbol);

module.exports = router;
