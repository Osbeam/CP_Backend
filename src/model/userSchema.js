const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");

const userSchema = mongoose.Schema({
    ProfileImage: { type: String, required: false },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    MobileNumber: { type: Number },
    Password: { type: String },
    ConfirmPassword: { type: String },
    EmailId: { type: String },
    Designation: {type: String},
    CompanyName: {type: String},
    Address: {type: String},
});

userSchema.plugin(timestamps);
module.exports = mongoose.model("CPUsers", userSchema);