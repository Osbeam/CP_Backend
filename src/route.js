const express = require("express");
const router = express.Router();
const imgUpload = require("./utils/imageUpload")

const userController = require("./controller/userController");
const salaryIncomeController = require("./controller/salaryIncomeController");
const bussinessIncomeController = require("./controller/bussinessIncomeController");
const professionalIncomeController = require("./controller/professionalIncomeController");
const loanFormController = require("./controller/loanFormController");
const callingDataController = require("./controller/callingDataController");


router.use("/user", userController);
router.use("/salaryIncome", salaryIncomeController);
router.use("/bussinessIncome", bussinessIncomeController);
router.use("/professionalIncome", professionalIncomeController);
router.use("/loanForm", loanFormController);
router.use("/callingData", callingDataController);




module.exports = router;