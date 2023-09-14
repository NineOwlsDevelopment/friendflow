const express = require("express");
const userController = require("../controllers/user.js");

const router = express.Router();

// @route GET /api/user
// @desc Get logged in user
// @access Private
router.get("/", userController.getcurrentUser);

module.exports = router;
