const Room = require("../models/Room");
const Message = require("../models/Message");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const { _id } = req.session.user;

    const room = await Room.create({
      name,
      owner: _id,
      users: [_id],
    });

    const user = await User.findById(_id);

    user.rooms.push(room._id);
    await user.save();

    return res.json(room);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

const getRooms = async (req, res) => {
  try {
    const { _id } = req.session.user;

    const rooms = await Room.find({ users: _id })
      .populate("users")
      .populate("messages")
      .exec();

    return res.json(rooms);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

const getRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id)
      .populate("users")
      .populate("messages")
      .exec();

    return res.json(room);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

const createMessage = async (req, res) => {
  try {
    const { _id } = req.session.user;
    const { id } = req.params;
    const { text } = req.body;

    const message = await Message.create({
      user: _id,
      room: id,
      text,
    });

    const room = await Room.findById(id);
    room.messages.push(message._id);
    await room.save();

    return res.json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  createMessage,
};
