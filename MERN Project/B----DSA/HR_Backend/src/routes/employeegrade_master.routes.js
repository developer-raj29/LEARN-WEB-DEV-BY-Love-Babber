const express=require("express");

const router=express.Router();
const authenticate=require("../middleware/authenticat.js")
const multer = require("multer") 
const upload = multer({ dest: 'uploads/' });
const employeegrade_master=require("../controllers/employeegrade_master.controller")
const {validateemployeegrade_masterAdd}=require("../middleware/validator")

router.post('/employeegrade_master',validateemployeegrade_masterAdd, employeegrade_master.employeegrade_masterAdd);
router.get('/employeegrade_masterGET', employeegrade_master.employeegrade_masterGET);
router.post('/employeegrade_masterDELETE/:id', employeegrade_master.employeegrade_masterDELETE);

router.post('/employeeTypeAdd', employeegrade_master.employeeTypeAdd);
router.get('/employeeTypeGET', employeegrade_master.employeeTypeGET);
router.post('/employeeTypeDELETE/:id', employeegrade_master.employeetypeDELETE);

router.post('/employeeDocumentAdd', employeegrade_master.employeeDocumentAdd);
router.get('/employeeDocumentGET', employeegrade_master.employeeDocumentGET);
router.post('/employeeDocumentDELETE/:id', employeegrade_master.employeeDocumentDELETE);
router.post('/DocumentsGET', employeegrade_master.DocumentsGET);


router.post('/ImportFile',upload.single('employee_mast_import'), employeegrade_master.ImportProfile);
router.post('/ImportSalStruc',upload.single('salary_structure_import'), employeegrade_master.ImportSalStruc);

router.post('/Department_Add', employeegrade_master.Department_Add);
router.get('/DepartmentGET', employeegrade_master.DepartmentGET);
router.post('/DepartmentDELETE/:id', employeegrade_master.DepartmentDELETE);

router.post('/Designation_Add', employeegrade_master.Designation_Add);
router.get('/DesignationGET', employeegrade_master.DesignationGET);
router.post('/DesignationDELETE/:id', employeegrade_master.DesignationDELETE);

router.get('/LeaveTypesGET', employeegrade_master.LeaveTypesGET);
router.post('/LeaveTypesDELETE/:id', employeegrade_master.LeaveTypesDELETE);
router.post('/LeaveTypes_Add', employeegrade_master.LeaveTypes_Add);

module.exports=router; 