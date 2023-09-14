const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const commentSchema = new Schema(
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
    post: {
      type: String,
      ref: "Post",
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        default: "",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
