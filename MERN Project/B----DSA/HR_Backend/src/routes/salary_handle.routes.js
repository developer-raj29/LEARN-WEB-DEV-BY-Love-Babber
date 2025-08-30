const express=require("express");

const router=express.Router();
const authenticate=require("../middleware/authenticat.js")

const salary_handle=require("../controllers/salary_handle.controller.js")
const {validateemployeegrade_masterAdd}=require("../middleware/validator.js")

router.post('/Salary_List', salary_handle.Salary_List);
router.post('/DeleteSalary', salary_handle.DeleteSalary);
router.post('/GenerateSalary', salary_handle.GenerateSalary);

module.exports=router; 