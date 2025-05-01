const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");

const userSchema = mongoose.Schema({
    ProfileImage: { type: String, required: false },
    FirstName: { type: String, required: true },
    MiddleName: { type: String},
    LastName: { type: String, required: true },
    EmailId: { type: String },
    MobileNumber: { type: Number },
    DateOfBirth: { type: String },
    Gender: { type: String, enum:["Male", "Female"] },
    RefralCode: { type: String },
    Password: { type: String },
    ConfirmPassword: { type: String },
    PanNumber: { type: String },
    AadharNumber: { type: String },
    FatherName: { type: String },
    CurrentAddress: {type: String},
    BankName: {type: String},
    AccountNumber: {type: Number},
    ConfirmAccountNumber: {type: Number},
    IfscCode: {type: String},
    AccountType: {type: String},
    UploadPanCard: {type: String},
    UploadAadharCard: {type: String},
    UploadPhoto: {type: String},
    UploadCheque: {type: String},
    UploadBankStatement: {type: String}
});

userSchema.plugin(timestamps);
module.exports = mongoose.model("CPUsers", userSchema);