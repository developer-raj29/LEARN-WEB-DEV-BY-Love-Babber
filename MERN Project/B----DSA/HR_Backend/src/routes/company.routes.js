const express=require("express");

const router=express.Router();
const companyController=require("../controllers/company.controller.js")
const multer = require("multer") 
const upload = multer({ dest: 'uploads/' });
const {companyByUserValidator,ComDivisionValidator}=require("../middleware/validator")
const authenticate=require("../middleware/authenticat.js")

router.post("/code_co",authenticate,companyByUserValidator,companyController.companyByUser)
router.post("/div_co",authenticate,ComDivisionValidator,companyController.ComDivision)

module.exports=router;