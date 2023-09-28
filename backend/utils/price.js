const Coin = require("../models/Coin");
const Key = require("../models/Key");
const User = require("../models/User");
const axios = require("axios");

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

const getTradePrice = async (side, amount, influencerId) => {
  try {
    const DIVISOR = process.env.BONDED_CURVE_DIVISOR;

    // Validate input
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

    if (side === "buy") {
      let intAmount = Math.floor(amount);
      let fractionalAmount = amount - intAmount;
      let price = 0;

      for (let i = 0; i < intAmount; i++) {
        price += (supply * Math.pow(supply, 2)) / DIVISOR;
        supply++;
      }

      if (fractionalAmount > 0) {
        price += ((supply * Math.pow(supply, 2)) / DIVISOR) * fractionalAmount;
        supply += fractionalAmount;
      }

      return { price, supply };
    }

    if (side === "sell") {
      let intAmount = Math.floor(amount);
      let fractionalAmount = amount - intAmount;
      let price = 0;

      for (let i = 0; i < intAmount; i++) {
        price += (supply * Math.pow(supply, 2)) / DIVISOR;
        supply--;
      }

      if (fractionalAmount > 0) {
        price += ((supply * Math.pow(supply, 2)) / DIVISOR) * fractionalAmount;
        supply -= fractionalAmount;
      }

      // if (supply < 0 || price < 0 || isNaN(price)) {
      //   console.log(supply, price);
      //   return 0.000001;
      // }

      return { price, supply };
    }
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

    const friends = keys.reduce((acc, key) => {
      if (acc[key.influencer]) {
        acc[key.influencer] += key.quantity;
      } else {
        acc[key.influencer] = key.quantity;
      }
      return acc;
    }, {});

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
};
