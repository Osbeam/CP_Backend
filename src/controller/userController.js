const express = require("express");
const userController = express.Router();
const userServices = require("../services/userServices");
const UserInfo = require("../model/userSchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload")
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone'); 
const auth = require('../utils/auth');




const uploadimg = imgUpload.fields([
  { name: 'ProfileImage', maxCount: 1 }
]);


userController.post('/Register', async (req, res) => {
  try {
    const { Password, ConfirmPassword } = req.body;

    const existingUser = await UserInfo.findOne({
      $or: [{ EmailId: req.body.EmailId }, { MobileNumber: req.body.MobileNumber }]
    });

    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "Email or mobile number already exists"
      });
    }
    if (Password !== ConfirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Password and confirm password do not match"
      });
    }

    const userData = { ...req.body };

    const userCreated = new UserInfo(userData);
    await userCreated.save();

    sendResponse(res, 200, "Success", {
      success: true,
      message: "User Registered successfully!",
      userData: userCreated
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});


userController.post("/Login", async (req, res) => {
  try {
    const { EmailId, Password } = req.body;
    const loggedUser = await userServices.UserLogin({ EmailId, Password });

    if (!loggedUser) {
      return sendResponse(res, 401, "Unauthorized", {
        success: false,
        message: "Invalid Userdetails",
      });
    }
    console.log("Logged User:", loggedUser);

    const token = await jwt.sign({ loggedUser }, process.env.JWT_KEY);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Logged in successfully",
      token,
      loggedUser,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.put("/update", uploadimg, async (req, res) => {
  try {
    const data = await userServices.updateData({ _id: req.body._id }, req.body);

    // Check if files are present in the request and specifically if ProfileImage is there
    if (req.files && req.files.ProfileImage) {
      data.ProfileImage = req.files.ProfileImage[0].path;
      
      await data.save();
    }

    sendResponse(res, 200, "Success", {
      success: true,
      message: "User updated successfully!",
      data: data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      success: false,
      message: error.message || "Internal server error",
    });
  }
});



userController.get("/getUserbyId/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await UserInfo.findById(userId); 
    
    if (!data) {
      return sendResponse(res, 404, "Not Found", {
        success: false,
        message: "User not found",
      });
    }

    sendResponse(res, 200, "Success", {
      success: true,
      message: "User retrieved successfully!",
      data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});



module.exports = userController;