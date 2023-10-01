const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const feeSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Fee = model("Fee", feeSchema);
module.exports = Fee;
