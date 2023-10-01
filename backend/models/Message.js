const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const messageSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    author: {
      type: String,
      ref: "User",
      required: true,
    },
    room: {
      type: String,
      ref: "Room",
      required: true,
    },
    body: {
      type: String,
      required: true,
      maxlength: 1000,
      minlength: 1,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Message = model("Message", messageSchema);

module.exports = Message;
