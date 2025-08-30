const express=require("express");

const router=express.Router();
const authenticate=require("../middleware/authenticat.js")
const multer = require("multer") 
const upload = multer({ dest: 'uploads/' });
const attendance=require("../controllers/attendance.controller.js")
const {validateemployeegrade_masterAdd}=require("../middleware/validator.js")

router.post('/GetMonthsDateattendance', attendance.GetMonthsDateattendance);
router.post('/Getattendance', attendance.Getattendance);
router.post('/GetattendanceDetails', attendance.GetattendanceDetails);
router.post('/GetattendanceShift', attendance.GetattendanceShift);
router.post('/Getattendancedept', attendance.Getattendancedept);
router.post('/shiftTypeGET', attendance.shiftTypeGET);
router.post('/LeaveTypeGET', attendance.LeaveTypeGET);
router.post('/DepartmentTypeGET', attendance.DepartmentTypeGET);
router.post('/salaryStrucGET', attendance.salaryStrucGET);
router.post('/EmployeeNamesGET', attendance.EmployeeNamesGET);
router.post('/AddAttendance', attendance.AddAttendance);
router.post('/GetattendanceDetailsold', attendance.GetattendanceDetailsold);
router.post('/GetEmployeesList', attendance.GetEmployeesList);

router.post('/UpdateAttandance/:id', attendance.UpdateAttandance);
router.post('/GetEmpAttendanceDetail', attendance.GetEmpAttendanceDetail);
router.post('/GetSalary', attendance.GetSalary);
router.post('/GetattendanceDetailsReport', attendance.GetattendanceDetailsReport);
router.post('/Importdailyatten_import',upload.single('dailyatten_import'), attendance.Importdailyatten_import);
router.post('/Updatedailyatten_import',upload.single('dailyatten_import'), attendance.Updatedailyatten_import);
router.post('/GetAbsentReport', attendance.GetAbsentReport);
router.post('/GetAllEmpAttendanceDetail', attendance.GetAllEmpAttendanceDetail);
router.post('/UpdateAttendanceByEmployee', attendance.UpdateAttendanceByEmployee);
router.post('/AttendanceFileDownload', attendance.AttendanceFileDownload);
router.post('/AddAttendanceByEmployee', attendance.AddAttendanceByEmployee);
router.post('/AttendCronManual', attendance.AttendCronManual);
router.post('/AttandanceDELETE/:id', attendance.AttandanceDELETE);

module.exports=router; 