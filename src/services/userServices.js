const mongoose = require("mongoose");
const User = require("../model/userSchema");
const { body } = require("express-validator");


exports.UserLogin = async (query) => {
  return await User.findOne(query);
};



exports.updateData = async (filter, update) => {
  return await User.findOneAndUpdate(filter, update, { new: true });
};

