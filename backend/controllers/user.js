const express = require("express");
const User = require("../models/User");

// @route   GET /api/user
// @desc    Get logged in user
// @access  Private
const getcurrentUser = async (req, res) => {
  try {
    console.log(req.session);
    return res.send(req.session);
    // const user = await User.findOne({ username: req.params.username })
    //   .populate("followers")
    //   .populate("following")
    //   .populate("posts")
    //   .exec();

    // if (!user) {
    //   return res.status(404).send("User not found");
    // }

    // res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  getcurrentUser,
};
