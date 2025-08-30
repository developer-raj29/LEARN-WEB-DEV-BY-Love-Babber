
const express=require("express");

const router=express.Router();
const authenticate=require("../middleware/authenticat.js")

const leave_req=require("../controllers/leave.controller.js")
const {validateemployeegrade_masterAdd}=require("../middleware/validator.js")

router.post('/LeaveReqAdd', leave_req.LeaveReqAdd);
router.post('/ReasonsGET', leave_req.ReasonsGET);
router.post('/MaxReqNo', leave_req.MaxReqNo);
router.post('/LeaveReqGET', leave_req.LeaveReqGET);
router.post('/LeaveReqUpdate', leave_req.LeaveReqUpdate);
router.get('/LeaveReqListGET', leave_req.LeaveReqListGET);
router.post('/LeaveReqDELETE/:id', leave_req.LeaveReqDELETE);
router.post('/LeaveReqEdit', leave_req.LeaveReqEdit);


module.exports=router; 