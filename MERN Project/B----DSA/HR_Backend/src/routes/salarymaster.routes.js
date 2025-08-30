const express=require("express");

const router=express.Router();
const authenticate=require("../middleware/authenticat.js")

const salarymaster=require("../controllers/salarymaster.controller.js")
const {validateemployeegrade_masterAdd}=require("../middleware/validator.js")

router.post('/salarymasterAdd', salarymaster.Add_Salary_Head);
router.get('/salary_headListGET', salarymaster.salary_headListGET);
router.post('/salary_headDELETE/:id', salarymaster.salary_headDELETE);
router.post('/salaryHeadGet', salarymaster.salaryHeadGet);
router.post('/salaryStrucADD', salarymaster.salaryStrucADD);
router.get('/salary_strucListGET', salarymaster.salary_strucListGET);
router.post('/salary_StrucDELETE/:id', salarymaster.salary_StrucDELETE);
router.post('/salary_strucEditData', salarymaster.salary_strucEditData);
router.post('/salaryStrucUpdate', salarymaster.salaryStrucUpdate);

module.exports=router; 