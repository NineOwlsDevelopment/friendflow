const Room = require("../models/Room");
const Message = require("../models/Message");
const User = require("../models/User");
const Key = require("../models/Key");

// @route   POST api/room
// @desc    Create a room
// @access  Private
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

// @route   GET api/room
// @desc    Get all rooms
// @access  Private
const getRooms = async (req, res) => {
  try {
    const { _id } = req.session.user;

    const room = await Room.find({ users: _id })
      .populate("users")
      .populate("messages");

    return res.status(200).send(rooms);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

// @route   GET api/room/:owner
// @desc    Get a room by owner id
// @access  Private
const getRoom = async (req, res) => {
  try {
    console.log(req.session);
    const user = await User.findOne({ _id: req.session.user });

    if (!user) return res.status(404).send("User not found");
    if (!req.params.owner_id)
      return res.status(400).send("Owner id is required");

    const room = await Room.findOne({ owner: req.params.owner_id });
    const influencer = await User.findOne({ _id: room.owner });

    if (!room) return res.status(404).send("Room not found");
    if (!influencer) return res.status(404).send("Influencer not found");

    // If the user is the owner of the room, return the room
    if (user._id === influencer._id) {
      await room.populate({
        path: "messages",
        options: {
          limit: 50,
          sort: { createdAt: 1 },
        },
      });

      return res.status(200).send(room);
    }

    const keysOwned = influencer.holders.filter(
      (holder) => holder.user.toString() === user._id.toString()
    )[0]?.quantity;

    // console.log("Keys owned:", keysOwned);

    if (!keysOwned) {
      return res.status(401).send({
        hasAccess: false,
      });
    }

    if (keysOwned < influencer.minimumKeys) {
      console.log("Key requirement not met for room:", room.name);
      return res.status(401).send({
        hasAccess: false,
      });
    }

    if (!room.users.includes(user._id)) {
      room.users.push(user._id);
      await room.save();
    }

    await room.populate({
      path: "messages",
      options: {
        limit: 50,
        sort: { createdAt: 1 },
      },
      populate: {
        path: "author",
        model: "User",
      },
    });

    return res.status(200).send(room);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoom,
};
