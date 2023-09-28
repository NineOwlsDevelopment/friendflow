const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const User = require("../models/User");
const Key = require("../models/Key");

// @route  GET api/transaction
// @desc   Get all transactions
// @access Public
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .limit(20)
      .sort({ createdAt: -1 })
      .populate("user", ["username", "displayName", "_id", "avatar"])
      .populate("influencer", [
        "username",
        "displayName",
        "_id",
        "avatar",
        "claimed",
      ]);

    return res.status(200).send(transactions);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route  GET api/transaction
// @desc   Get all transactions for a user
// @access Public
const getTransactionsByUser = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.params.id,
    }).limit(10);

    return res.status(200).send(transactions);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route  GET api/transaction/:id
// @desc   Get transaction by id
// @access Public
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id });

    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }

    return res.status(200).send(transaction);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route  POST api/transaction
// @desc   Create a transaction
// @access Private
const createTransaction = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route  PUT api/transaction/:id
// @desc   Update a transaction
// @access Private
const updateTransaction = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route  DELETE api/transaction/:id
// @desc   Delete a transaction
// @access Private
const deleteTransaction = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  getTransactionsByUser,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
