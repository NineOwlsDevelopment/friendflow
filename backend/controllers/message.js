const Room = require("../models/Room");
const Message = require("../models/Message");
const User = require("../models/User");
const Key = require("../models/Key");

// @route   POST api/message/:room_id
// @desc    Create a message
// @access  Private
const createMessage = async (req, res) => {
  try {
    const { io } = req;
    const { room_id } = req.params;
    const { body } = req.body;

    if (!io) {
      return res.status(400).send("Socket.io is not initialized");
    }

    if (body.trim() === "") {
      return res.status(400).send("Message cannot be empty");
    }

    const user = await User.getUser(req.session.user);

    if (!user) {
      return res.status(511).send("User not found");
    }

    const room = await Room.findOne({
      $or: [
        { _id: room_id, users: { $in: [user._id] } },
        { _id: room_id, owner: user._id },
      ],
    });

    if (!room) {
      return res.status(400).send("Room not found");
    }

    // add user to room if not already in room and user is owner.
    // This is primarily for when an unclaimed account becomes claimed.
    if (!room.users.includes(user._id) && room.owner === user._id) {
      room.users.push(user._id);
    }

    const message = await Message.create({
      body: body.toString(),
      author: user._id,
      room: room_id,
    });

    room.messages.push(message._id);

    await room.save();
    await message.save();

    await message.populate("author");

    // Emit the message to the room
    io.to(room_id).emit("new_message", message);

    return res.status(200).send(message);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   GET api/message/:id
// @desc    Get a message by id
// @access  Private
const getMessage = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   PUT api/message/:id
// @desc    Update a message
// @access  Private
const updateMessage = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   DELETE api/message/:id
// @desc    Delete a message
// @access  Private
const deleteMessage = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  createMessage,
  getMessage,
  updateMessage,
  deleteMessage,
};
