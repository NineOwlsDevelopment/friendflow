const express = require("express");
const keyController = require("../controllers/key.js");

const router = express.Router();

// @route   POST api/key
// @desc    Create a key
// @access  Private
// router.post("/", keyController.createKey);

// @route   GET api/key
// @desc    Get all keys for a user
// @access  Private
// router.get("/", keyController.getKeys);

// @route   GET api/key/:id
// @desc    Get key by id
// @access  Private
// router.get("/:id", keyController.getKeyById);

// @route   DELETE api/key/:id
// @desc    Delete a key
// @access  Private
// router.delete("/:id", keyController.deleteKey);

module.exports = router;
