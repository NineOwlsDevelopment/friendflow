const express = require("express");
const transactionController = require("../controllers/transaction");
const router = express.Router();

// @route  GET api/transaction
// @desc   Get all transactions
// @access Public
router.get("/", transactionController.getTransactions);

// @route  GET api/transaction
// @desc   Get all transactions for a user
// @access Public
router.get("/user/:id", transactionController.getTransactionsByUser);

// @route  GET api/transaction/:id
// @desc   Get transaction by id
// @access Public
router.get("/:id", transactionController.getTransactionById);

// // @route  POST api/transaction
// // @desc   Create a transaction
// // @access Private
// router.post("/", transactionController.createTransaction);

// // @route  PUT api/transaction/:id
// // @desc   Update a transaction
// // @access Private
// router.put("/:id", transactionController.updateTransaction);

// // @route  DELETE api/transaction/:id
// // @desc   Delete a transaction
// // @access Private
// router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
