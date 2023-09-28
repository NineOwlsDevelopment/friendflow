const express = require("express");
const roomController = require("../controllers/room.js");

const router = express.Router();

// @route   POST api/room
// @desc    Create a room
// @access  Private
// router.post("/", roomController.createRoom);

// @route   GET api/room
// @desc    Get all rooms
// @access  Private
// router.get("/", roomController.getRooms);

// @route   GET api/room/:owner_id
// @desc    Get a room
// @access  Private
router.get("/:owner_id", roomController.getRoom);

module.exports = router;
