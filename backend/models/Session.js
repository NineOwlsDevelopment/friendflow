const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const sessionSchema = new Schema(
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
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.__v;
      },
    },
  }
);

const Session = model("Session", sessionSchema);

module.exports = Session;
