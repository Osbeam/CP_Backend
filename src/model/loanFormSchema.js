const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");


const loanFormSchema = mongoose.Schema({
    Name: { type: String },
    LoanType: { type: String },
    LoanAmount: { type: String },
    MobileNo: { type: Number },
    EmailId: { type: String },
    PanCard: { type: String },
    AadharCard: { type: String },
    BankStatement: { type: String },
    Photo: { type: String },
    SalarySlip: { type: String },
    TwoYearITR: { type: String },
    IncomeType: {   
        type: [String],
        enum: ['BusinessIncome', 'ProfessionalIncome', 'SalaryIncome']  
    },
});

loanFormSchema.plugin(timestamps);
module.exports = mongoose.model("CPLoan", loanFormSchema);
