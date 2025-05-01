const express = require("express");
const callingDataController = express.Router();
const CallingData = require("../model/callingDataSchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload")
const upload = require("../utils/excelUpload")
const fs = require('fs');
const xlsx = require('xlsx');
const multer = require('multer');
const auth = require('../utils/auth');




callingDataController.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const Employer = req.body.Employer; // Get employer ID from the request body
    const workbook = xlsx.readFile(file.path);
    const sheet_name_list = workbook.SheetNames;
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    // Add employerId to each document
    const dataWithEmployer = jsonData.map(item => ({ ...item, Employer }));
    const uniqueEntries = new Set();
        const deduplicatedData = dataWithEmployer.filter(item => {
          const uniqueKey = item.MobileNo1; // Use MobileNo1 as the unique identifier
          if (!uniqueEntries.has(uniqueKey)) {
            uniqueEntries.add(uniqueKey);
            return true;
          }
          return false;
        });

    const savedData = await CallingData.insertMany(deduplicatedData);
    sendResponse(res, 200, 'Success', {
      success: true,
      message: 'Excel file uploaded and data saved successfully',
      data: savedData
    });
  } catch (error) {
    console.error('Error uploading Excel file:', error);
    sendResponse(res, 500, 'Failed', {
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});



module.exports = callingDataController;