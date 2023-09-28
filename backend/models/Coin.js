const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const coinSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
      required: true,
    },
    symbol: {
      type: String,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const Coin = model("Coin", coinSchema);

module.exports = Coin;
