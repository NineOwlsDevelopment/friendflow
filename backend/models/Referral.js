const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const referralSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
    },
    referredUsers: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Referral = model("Referral", referralSchema);

module.exports = Referral;
