const express = require("express");
const userController = require("../controllers/user.js");

const router = express.Router();

// @route POST /api/user
// @desc Manually add a user
// @access Private
router.post("/", userController.createUser);

// @route GET /api/user
// @desc Get current user
// @access Private
router.get("/", userController.getcurrentUser);

// @route GET /api/user/friends
// @desc Get friends
// @access Private
router.get("/friends", userController.getFriends);

// @route GET /api/user/top
// @desc Get top users
// @access Public
router.get("/top", userController.getTopUsers);

// @route GET /api/user/:id
// @desc Get user by id
// @access Public
router.get("/:id", userController.getUserById);

// @route GET /api/user/search/:username
// @desc Search for users by username
// @access Public
router.get("/search/:username", userController.searchUsers);

// @route PUT /api/user
// @desc Update user
// @access Private
router.put("/", userController.updateUser);

module.exports = router;
