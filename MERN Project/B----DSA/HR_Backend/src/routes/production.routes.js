const express=require("express");

const router=express.Router();
const authenticate=require("../middleware/authenticat.js")

const production=require("../controllers/production.controller.js")
const {validateemployeegrade_masterAdd}=require("../middleware/validator.js")

router.post('/DepartmentTypeGET', production.DepartmentTypeGET);
router.get('/shiftListGET', production.shiftGET);
router.post('/MachineMasterADD', production.MachineMasterADD);
router.get('/MachineMasterGET', production.MachineMasterGET);
router.post('/MachineMasterDELETE/:id', production.MachineMasterDELETE);
router.post('/MachineMasterUpdate', production.MachineMasterUpdate);


module.exports=router; 