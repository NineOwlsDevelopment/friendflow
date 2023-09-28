const Coin = require("../models/Coin");
const axios = require("axios");

// @route   Post /api/coin
// @desc    Add a coin
// @access  Private
const createCoin = async (req, res) => {
  try {
    const passcode = process.env.PASSCODE;

    if (req.body.passcode !== passcode) {
      return res.status(401).send("Unauthorized");
    }

    const apiKey = process.env.CMC_API_KEY;
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`;

    const result = await axios.get(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
      },
    });

    const price = result.data.data[symbol].quote.USD.price;

    const coin = new Coin({
      name: req.body.name.toLowerCase(),
      image: req.body.image,
      symbol: req.body.symbol.toUpperCase(),
      price: price,
    });

    await coin.save();

    return res.status(201).send(coin);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   Get /api/coin
// @desc    Get all coins
// @access  Public
const getCoins = async (req, res) => {
  try {
    const coins = await Coin.find();

    return res.status(200).send(coins);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   Get /api/coin/:symbol
// @desc    Get coin by symbol
// @access  Public
const getCoinBySymbol = async (req, res) => {
  try {
    const coin = await Coin.findOne({ symbol: req.params.symbol });

    if (!coin) {
      return res.status(404).send("Coin not found");
    }

    return res.status(200).send(coin);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   Put /api/coin/:symbol
// @desc    Update coin by symbol
// @access  Private
const updateCoinBySymbol = async (req, res) => {
  try {
    const passcode = process.env.PASSCODE;

    if (req.body.passcode !== passcode) {
      return res.status(401).send("Unauthorized");
    }

    const coin = await Coin.findOne({ symbol: req.params.symbol });

    if (!coin) {
      return res.status(404).send("Coin not found");
    }

    coin.name = req.body.name.toLowerCase();
    coin.symbol = req.body.symbol.toLowerCase();
    coin.price = req.body.price;

    await coin.save();

    return res.status(200).send(coin);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   Delete /api/coin/:symbol
// @desc    Delete coin by symbol
// @access  Private
const deleteCoinBySymbol = async (req, res) => {
  try {
    const passcode = process.env.PASSCODE;

    if (req.body.passcode !== passcode) {
      return res.status(401).send("Unauthorized");
    }

    const coin = await Coin.findOne({ symbol: req.params.symbol });

    if (!coin) {
      return res.status(404).send("Coin not found");
    }

    await coin.remove();

    return res.status(200).send("Coin deleted");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  createCoin,
  getCoins,
  getCoinBySymbol,
  updateCoinBySymbol,
  deleteCoinBySymbol,
};
