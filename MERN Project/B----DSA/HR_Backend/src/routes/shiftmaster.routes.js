const express=require("express");

const router=express.Router();
const authenticate=require("../middleware/authenticat.js")

const shiftmaster=require("../controllers/shiftmaster.controller.js")
const {validateemployeegrade_masterAdd}=require("../middleware/validator.js")

router.post('/shiftAdd', shiftmaster.shiftAdd);
router.get('/shiftListGET', shiftmaster.shiftGET);
router.post('/shiftDELETE/:id', shiftmaster.shiftDELETE);

module.exports=router; 