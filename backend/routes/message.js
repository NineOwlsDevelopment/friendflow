const express = require("express");
const messageController = require("../controllers/message.js");

const router = express.Router();

// @route   POST api/message/:room_id
// @desc    Create a message
// @access  Private
router.post("/:room_id", messageController.createMessage);

// @route   GET api/message/:id
// @desc    Get a message by id
// @access  Private
router.get("/:id", messageController.getMessage);

// @route   PUT api/message/:id
// @desc    Update a message
// @access  Private
router.put("/:id", messageController.updateMessage);

// @route   DELETE api/message/:id
// @desc    Delete a message
// @access  Private
router.delete("/:id", messageController.deleteMessage);

module.exports = router;
