const express=require("express");

const router=express.Router();
const authenticate=require("../middleware/authenticat.js")

const advance=require("../controllers/advance.controller.js")
const {validateemployeegrade_masterAdd}=require("../middleware/validator.js")
const multer = require("multer") 
const upload = multer({ dest: 'uploads/' });

router.post('/GetSalary', advance.GetSalary);
router.post('/UpdateAdvance', advance.UpdateAdvance);
router.post('/AdvanceList', advance.AdvanceList);
router.post('/GivenAdvanceListGET', advance.GivenAdvanceListGET);
router.post('/AdvanceDELETE/:id', advance.AdvanceDELETE);
router.post('/ImportFile',upload.single('advance_import'), advance.advance_import);

module.exports=router; 