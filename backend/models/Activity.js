const { v4: uuidv4 } = require("uuid");
const { model, Schema } = require("mongoose");

const activities = [
  "like",
  "comment",
  "update",
  "delete",
  "share",
  "post",
  "follow",
  "unfollow",
  "mention",
  "tag",
];

const activitySchema = new Schema(
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
    action: {
      type: String,
      required: true,
      enum: activities,
    },
    postId: {
      type: String,
      ref: "Post",
    },
    commentId: {
      type: String,
      ref: "Comment",
    },
    userId: {
      type: String,
      ref: "User",
    },
    updatedField: String,
    oldValue: String,
    newValue: String,
  },
  { timestamps: true }
);

const Activity = model("Activity", activitySchema);

module.exports = Activity;
