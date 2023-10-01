const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const transactionSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    user: {
      type: String,
      ref: "User",
    },
    influencer: {
      type: String,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
