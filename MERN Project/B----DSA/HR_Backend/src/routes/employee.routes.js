const express=require("express");

const router=express.Router();
const authenticate=require("../middleware/authenticat.js")
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

const employeeSchema=require("../controllers/employee.controller.js")
const {validateemployeegrade_masterAdd}=require("../middleware/validator.js")

router.post('/AddEmployee', employeeSchema.AddEmployee);
router.post('/DepartmentTypeGET', employeeSchema.DepartmentTypeGET);
router.post('/salaryHeadGet', employeeSchema.salaryHeadGet);
router.post('/EmployeeUpdate', employeeSchema.EmployeeUpdate);
router.post('/designationTypeGET', employeeSchema.designationTypeGET);
router.post('/CatTypeGET', employeeSchema.CatTypeGET);
router.post('/shiftGET', employeeSchema.shiftGET);
router.post('/BankGET', employeeSchema.BankGET);
router.post('/machine_mastGET', employeeSchema.machine_mastGET);
router.post('/EmployeeDocumentsUpdate',upload.array('files'), employeeSchema.EmployeeDocumentsUpdate);
router.post('/EmployeeDocumentsGet', employeeSchema.EmployeeDocumentsGet);
router.get('/EmpMasterFileDownload', employeeSchema.EmpMasterFileDownload);
router.post('/EmployeeSalaryHDGet', employeeSchema.EmployeeSalaryHDGet);
router.post('/EmployeeSalaryHDUpdate', employeeSchema.EmployeeSalaryHDUpdate);
router.post('/EmployeeLoanGet', employeeSchema.EmployeeLoanGet);
router.post('/EmployeeLoanUpdate', employeeSchema.EmployeeLoanUpdate);
router.post('/EmployeeLeavesGet', employeeSchema.EmployeeLeavesGet);

module.exports=router; 