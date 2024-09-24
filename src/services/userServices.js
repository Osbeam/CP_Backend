const mongoose = require("mongoose");
const User = require("../model/userSchema");
const { body } = require("express-validator");


exports.UserLogin = async ({ Password }) => {
  const user = await User.findOne();
  if (user && user.Password === Password) {
    return user;
  }
  return null;
};



exports.updateData = async (filter, update) => {
  return await User.findOneAndUpdate(filter, update, { new: true });
};

