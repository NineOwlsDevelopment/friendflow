const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const walletSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    chain: {
      type: String,
      enum: ["solana"],
      default: "solana",
      required: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      unique: true,
      required: true,
    },
    privateKey: {
      type: String,
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
    transform: (_, ret) => {
      delete ret.__v;
      delete privateKey;
    },
  }
);

const Wallet = model("Wallet", walletSchema);

module.exports = Wallet;
