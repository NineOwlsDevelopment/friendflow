const { LAMPORTS_PER_SOL } = require("@solana/web3.js");
const Coin = require("../models/Coin");
const Key = require("../models/Key");
const User = require("../models/User");
const axios = require("axios");
const bigInt = require("big-integer");

// Get the price of a coin from CoinMarketCap
const getCoinPrice = async (symbol) => {
  const apiKey = process.env.CMC_API_KEY;
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`;

  const result = await axios.get(url, {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
    },
  });

  return result.data.data[symbol].quote.USD.price;
};

// Update the price of all coins in the database to their USD value
const updateCoinPrices = async () => {
  const coins = await Coin.find({});

  const sleep = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  for await (const coin of coins) {
    const price = await getCoinPrice(coin.symbol);

    coin.price = price;

    await coin.save();
    sleep();
  }
};

// Algorithm to calculate the price of a key based on the number of keys in circulation
const getPrice = (circulating, amount) => {
  let sum1 =
    circulating === 0
      ? 0
      : ((circulating - 1) * circulating * (2 * (circulating - 1) + 1)) / 6;

  let sum2 =
    circulating === 0 && amount === 1
      ? 0
      : ((circulating - 1 + amount) *
          (circulating + amount) *
          (2 * (circulating - 1 + amount) + 1)) /
        6;

  let summation = sum2 - sum1;
  return Math.ceil((summation * LAMPORTS_PER_SOL) / 16000);
};

// Get the price of a trade based on the number of keys in circulation
const getTradePrice = async (side, amount, influencerId) => {
  try {
    if (!side || !amount || !influencerId) {
      throw new Error("Missing required fields.");
    }

    if (side !== "buy" && side !== "sell") {
      throw new Error("Invalid side.");
    }

    if (amount <= 0 || amount > 100) {
      throw new Error("Invalid amount.");
    }

    const influencer = await User.findOne({ _id: influencerId });

    let supply = influencer.holders.reduce((acc, holder) => {
      return acc + holder.quantity;
    }, 0);

    let price = Number(0);
    supply = Number(supply);
    amount = Number(amount);

    if (side === "buy") {
      price = getPrice(supply + 1, amount);
    }

    if (side === "sell") {
      price = getPrice(supply - amount + 1, amount);
    }

    console.log("price:", price);
    console.log("supply:", supply);

    return price;
  } catch (error) {
    console.error(error);
    throw new Error("Server error");
  }
};

const getPortfolioValue = async (userID) => {
  try {
    const user = await User.findOne({ _id: userID });

    if (!user) {
      throw new Error("User not found");
    }

    const keysArray = Object.keys(friends);

    const friendsArray = await User.find({ _id: { $in: keysArray } });

    const friendsWithQuantity = friendsArray.map((friend) => {
      return {
        ...friend._doc,
        currentlyHolding: friends[friend._id],
      };
    });

    // sort by currentlyHolding
    friendsWithQuantity.sort((a, b) => b.currentlyHolding - a.currentlyHolding);

    // get total value of portfolio
    const totalValue = friendsWithQuantity.reduce((acc, friend) => {
      return acc + friend.currentlyHolding * friend.price;
    }, 0);

    return { totalValue, friendsWithQuantity };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCoinPrice,
  updateCoinPrices,
  getTradePrice,
  getPortfolioValue,
  getPrice,
};
