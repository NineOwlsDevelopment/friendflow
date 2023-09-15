const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const postSchema = new Schema(
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
    likes: [
      {
        type: String,
        ref: "User",
      },
    ],
    comments: [
      {
        type: String,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);

module.exports = Post;
