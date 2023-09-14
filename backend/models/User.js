const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    solanaAddress: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    followers: [
      {
        type: String,
        ref: "User",
      },
    ],
    following: [
      {
        type: String,
        ref: "User",
      },
    ],
    posts: [
      {
        type: String,
        ref: "Post",
      },
    ],
    likes: [
      {
        type: String,
        ref: "Post",
      },
    ],
    comments: [
      {
        type: String,
        ref: "Comment",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
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

const User = model("User", userSchema);

module.exports = User;
