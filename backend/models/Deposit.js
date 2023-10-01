const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const depositSchema = new Schema(
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
    amount: {
      type: Number,
      default: 0,
    },
    txid: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Deposit = model("Deposit", depositSchema);

module.exports = Deposit;
