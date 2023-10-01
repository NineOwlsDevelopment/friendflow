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
    volume: {
      type: Number,
      default: 0,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    price: {
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
        delete ret.updatedAt;
        delete ret.createdAt;
        delete ret.marketCap;
        delete ret.minKeysLastUpdated;
      },
    },
  }
);

// add static method for getting user
userSchema.statics.getUser = async function (data) {
  const user = await this.findOne({
    $or: [{ _id: data }, { username: data }],
  }).select({
    username: 1,
    displayName: 1,
    avatar: 1,
    rank: 1,
    minimumKeys: 1,
    followers: 1,
    volume: 1,
    claimed: 1,
    holders: 1,
    holding: 1,
    price: 1,
    earnings: 1,
  });

  return user;
};

// add static method for getting user
userSchema.statics.getTopUsers = async function () {
  const users = await this.find({}).sort({ volume: -1 }).limit(50).select({
    username: 1,
    displayName: 1,
    avatar: 1,
    followers: 1,
    volume: 1,
    claimed: 1,
    holders: 1,
    holding: 1,
    price: 1,
  });

  return users;
};

// get user friends
userSchema.statics.getFriends = async function (data) {
  const user = await this.findOne({ _id: data }).populate("holding.user", {
    username: 1,
    displayName: 1,
    avatar: 1,
    followers: 1,
    volume: 1,
    claimed: 1,
    holders: 1,
    holding: 1,
    price: 1,
  });

  if (!user) {
    throw new Error("User not found");
  }

  // remove user from friends list
  const friends = user.holding.filter((friend) => {
    return friend.user.username !== user.username;
  });

  // get total value of portfolio
  const totalValue = friends.reduce((acc, friend) => {
    return acc + friend.quantity * friend.user.price;
  }, 0);

  return { friends, totalValue };
};

const User = model("User", userSchema);

module.exports = User;
