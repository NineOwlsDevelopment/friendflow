const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    twitterId: {
      type: String,
      sparse: true,
      index: {
        unique: true,
        partialFilterExpression: { twitterId: { $type: "string" } },
      },
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
      required: true,
    },
    displayName: {
      type: String,
      unique: true,
      sparse: true,
      trim: false,
      minLength: 3,
      maxLength: 50,
      required: true,
    },
    email: {
      type: String,
      sparse: true,
      trim: true,
      lowercase: true,
      index: {
        unique: true,
        partialFilterExpression: { email: { $type: "string" } },
      },
    },
    avatar: {
      type: String,
      default: "",
    },
    rank: {
      type: String,
      enum: ["socialite", "influencer", "celebrity", "legend"],
      default: "socialite",
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
    volume: {
      type: Number,
      default: 0,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    marketCap: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
      required: true,
    },
    following: {
      type: Number,
      default: 0,
      required: true,
    },
    holders: [
      {
        user: {
          type: String,
          ref: "User",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    holding: [
      {
        key: {
          type: String,
          ref: "User",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    minimumKeys: {
      type: Number,
      default: 1,
      required: true,
    },
    minKeysLastUpdated: {
      type: Date,
      default: Date.now() - 24 * 60 * 60 * 1000,
    },
    claimed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.__v;
        delete ret.email;
      },
    },
  }
);

const User = model("User", userSchema);

module.exports = User;
