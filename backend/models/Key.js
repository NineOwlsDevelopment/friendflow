const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const keySchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    influencer: {
      type: String,
      ref: "User",
      required: true,
    },
    holder: {
      type: String,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const Key = model("Key", keySchema);

module.exports = Key;
