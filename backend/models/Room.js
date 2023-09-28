const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const roomSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    owner: {
      type: String,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    users: [
      {
        type: String,
        ref: "User",
      },
    ],
    messages: [
      {
        type: String,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const Room = model("Room", roomSchema);

module.exports = Room;
