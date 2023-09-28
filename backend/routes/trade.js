const express = require("express");
const tradeController = require("../controllers/trade.js");

const router = express.Router();

// @route   POST api/trade/buy
// @desc    Create a buy trade
// @access  Private
router.post("/buy", tradeController.createBuy);

// @route   POST api/trade/sell
// @desc    Create a sell trade
// @access  Private
router.post("/sell", tradeController.createSell);

// @route   GET api/trade/estimate/:side/:amount/:influencer
// @desc    Get estimate cost of trade
// @access  Public
router.get(
  "/estimate/:side/:amount/:influencer",
  tradeController.getTradeEstimate
);

// @route   GET api/trade
// @desc    Get all trades for a user
// @access  Private
router.get("/", tradeController.getTrades);

// @route   GET api/trade/:id
// @desc    Get trade by id
// @access  Private
router.get("/:id", tradeController.getTradeById);

// @route   PUT api/trade/:id
// @desc    Update trade by id
// @access  Private
router.put("/:id", tradeController.updateTradeById);

// @route   DELETE api/trade/:id
// @desc    Delete trade by id
// @access  Private
router.delete("/:id", tradeController.deleteTradeById);

module.exports = router;
