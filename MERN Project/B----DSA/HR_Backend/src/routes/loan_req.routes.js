
const express=require("express");

const router=express.Router();
const authenticate=require("../middleware/authenticat.js")

const loan_req=require("../controllers/loan.controller.js")
const {validateemployeegrade_masterAdd}=require("../middleware/validator.js")

router.post('/LoanReqAdd', loan_req.LoanReqAdd);
router.get('/LoanReqListGET', loan_req.LoanReqListGET);
router.post('/LoanReqDELETE/:id', loan_req.LoanReqDELETE);
router.post('/LoanReqEdit', loan_req.LoanReqEdit);
router.post('/MaxReqNo', loan_req.MaxReqNo);
 router.post('/test', loan_req.test);

module.exports=router; 