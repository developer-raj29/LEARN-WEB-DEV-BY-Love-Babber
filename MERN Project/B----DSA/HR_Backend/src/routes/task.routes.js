const express=require("express");

const router=express.Router();
const authenticate=require("../middleware/authenticat.js")

const taskmaster=require("../controllers/task.controller.js")
const {validateemployeegrade_masterAdd}=require("../middleware/validator.js")

const multer = require("multer") 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/TaskAdd', taskmaster.TaskAdd);
router.get('/TaskGET', taskmaster.TaskGET);
router.post('/TaskDELETE/:id', taskmaster.TaskDELETE);
router.post('/PriorityGET', taskmaster.PriorityGET);
router.post('/TaskPlanAdd', taskmaster.TaskPlanAdd);
router.post('/GettasksDetails', taskmaster.GettasksDetails);
router.post('/TaskAssigneAdd',upload.array('images'), taskmaster.TaskAssigneAdd);
router.post('/GetEmployeeTasksDetails', taskmaster.GetEmployeeTasksDetails);
router.post('/TaskStatusUpdateByEmp', taskmaster.TaskStatusUpdateByEmp);

module.exports=router; 