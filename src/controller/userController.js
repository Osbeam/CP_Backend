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
const { userInfo } = require("os");


const uploadimg = imgUpload.fields([
  { name: 'ProfileImage', maxCount: 1 }
]);


userController.post(
  "/Register",
  imgUpload.fields([
    { name: "ProfileImage", maxCount: 1 },
    { name: "UploadPanCard", maxCount: 1 },
    { name: "UploadAadharCard", maxCount: 1 },
    { name: "UploadPhoto", maxCount: 1 },
    { name: "UploadCheque", maxCount: 1 },
    { name: "UploadBankStatement", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        FirstName,
        MiddleName,
        LastName,
        EmailId,
        MobileNumber,
        Password,
        ConfirmPassword,
        DateOfBirth,
        Gender,
        RefralCode,
        PanNumber,
        AadharNumber,
        FatherName,
        CurrentAddress,
        BankName,
        AccountNumber,
        ConfirmAccountNumber,
        IfscCode,
        AccountType
      } = req.body;

      // Check if user exists
      const existingUser = await UserInfo.findOne({
        $or: [{ EmailId }, { MobileNumber }]
      });

      if (existingUser) {
        return sendResponse(res, 409, "Conflict", {
          success: false,
          message: "Email or Mobile number already exists"
        });
      }

      // Password match check
      if (Password !== ConfirmPassword) {
        return sendResponse(res, 400, "Bad Request", {
          success: false,
          message: "Password and Confirm Password do not match"
        });
      }

      // Prepare file paths if uploaded
      const files = req.files;
      const userData = {
        FirstName,
        MiddleName,
        LastName,
        EmailId,
        MobileNumber,
        Password,
        DateOfBirth,
        Gender,
        RefralCode,
        PanNumber,
        AadharNumber,
        FatherName,
        CurrentAddress,
        BankName,
        AccountNumber,
        ConfirmAccountNumber,
        IfscCode,
        AccountType,
        ProfileImage: files?.ProfileImage?.[0]?.path || "",
        UploadPanCard: files?.UploadPanCard?.[0]?.path || "",
        UploadAadharCard: files?.UploadAadharCard?.[0]?.path || "",
        UploadPhoto: files?.UploadPhoto?.[0]?.path || "",
        UploadCheque: files?.UploadCheque?.[0]?.path || "",
        UploadBankStatement: files?.UploadBankStatement?.[0]?.path || ""
      };

      const userCreated = new UserInfo(userData);
      await userCreated.save();

      return sendResponse(res, 200, "Success", {
        success: true,
        message: "User Registered successfully!",
        UserData: userCreated
      });
    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, "Internal Server Error", {
        success: false,
        message: error.message || "Something went wrong"
      });
    }
  }
);


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


userController.put(
  "/update",
  imgUpload.fields([
    { name: "ProfileImage", maxCount: 1 },
    { name: "UploadPanCard", maxCount: 1 },
    { name: "UploadAadharCard", maxCount: 1 },
    { name: "UploadPhoto", maxCount: 1 },
    { name: "UploadCheque", maxCount: 1 },
    { name: "UploadBankStatement", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        _id,
        FirstName,
        LastName,
        MobileNumber,
        Designation,
        Address
      } = req.body;

      const files = req.files;

      const updateFields = {
        FirstName,
        LastName,
        MobileNumber,
        Designation,
        Address,
      };

      // Attach uploaded file paths only if files are sent
      if (files?.ProfileImage) updateFields.ProfileImage = files.ProfileImage[0].path;
      if (files?.UploadPanCard) updateFields.UploadPanCard = files.UploadPanCard[0].path;
      if (files?.UploadAadharCard) updateFields.UploadAadharCard = files.UploadAadharCard[0].path;
      if (files?.UploadPhoto) updateFields.UploadPhoto = files.UploadPhoto[0].path;
      if (files?.UploadCheque) updateFields.UploadCheque = files.UploadCheque[0].path;
      if (files?.UploadBankStatement) updateFields.UploadBankStatement = files.UploadBankStatement[0].path;

      const updatedUser = await UserInfo.findByIdAndUpdate(
        _id,
        { $set: updateFields },
        { new: true }
      );

      if (!updatedUser) {
        return sendResponse(res, 404, "Not Found", {
          success: false,
          message: "User not found"
        });
      }

      return sendResponse(res, 200, "Success", {
        success: true,
        message: "User updated successfully",
        UserData: updatedUser
      });
    } catch (error) {
      console.error("Update Error:", error);
      return sendResponse(res, 500, "Internal Server Error", {
        success: false,
        message: error.message || "Something went wrong"
      });
    }
  }
);


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


userController.get("/getAllUsers", async (req, res) => {
  try {

    const data = await UserInfo.findOne({}); 
    
    if (!data) {
      return sendResponse(res, 404, "Not Found", {
        success: false,
        message: "Users not found",
      });
    }

    sendResponse(res, 200, "Success", {
      success: true,
      message: "users retrieved successfully!",
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