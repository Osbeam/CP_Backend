const express = require("express");
const LoanFormController = express.Router();
const { sendResponse } = require("../utils/common");
const LoanForm = require("../model/loanFormSchema");
const imgUpload = require("../utils/imageUpload");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });


const uploadimg = imgUpload.fields([
  { name: "Photo", maxCount: 1 },
  { name: "PanCard", maxCount: 1 },
  { name: "AadharCard", maxCount: 1 },
  { name: "BankStatement", maxCount: 1 },
  { name: "SalarySlip", maxCount: 1 },
  { name: "TwoYearITR", maxCount: 1 }
]);




LoanFormController.put("/createOrUpdateLoanForm/:id?", uploadimg, async (req, res) => {
  try {
    const loanId = req.params.id;
    console.log('Request Body:', req.body);
    console.log('Uploaded Files:', req.files);

    const loanData = { 
      ...req.body,
      Photo: req.files?.Photo ? req.files.Photo[0].path : null,
      PanCard: req.files?.PanCard ? req.files.PanCard[0].path : null,
      AadharCard: req.files?.AadharCard ? req.files.AadharCard[0].path : null,
      BankStatement: req.files?.BankStatement ? req.files.BankStatement[0].path : null,
      SalarySlip: req.files?.SalarySlip ? req.files.SalarySlip[0].path : null,
      TwoYearITR: req.files?.TwoYearITR ? req.files.TwoYearITR[0].path : null
    };

    let loanCreatedOrUpdated;

    if (loanId) {
      const existingLoanForm = await LoanForm.findById(loanId);

      if (existingLoanForm) {
        loanCreatedOrUpdated = await LoanForm.findByIdAndUpdate(loanId, loanData, { new: true });
        sendResponse(res, 200, "Success", {
          success: true,
          message: "Loan Form updated successfully!",
          loanData: loanCreatedOrUpdated,
        });
      } else {
        sendResponse(res, 404, "Not Found", {
          success: false,
          message: "Loan Form not found!",
        });
      }
    } else {
      loanCreatedOrUpdated = await LoanForm.create(loanData);
      sendResponse(res, 201, "Created", {
        success: true,
        message: "Loan Form created successfully!",
        loanData: loanCreatedOrUpdated,
      });
    }
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


LoanFormController.get("/getAllLoanForms", async (req, res) => {
  try {

    const data = await LoanForm.findOne(req.body); 
    
    if (!data) {
      return sendResponse(res, 404, "Not Found", {
        success: false,
        message: "Loan Forms not found",
      });
    }

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Loan Forms retrieved successfully!",
      data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});




module.exports = LoanFormController;
