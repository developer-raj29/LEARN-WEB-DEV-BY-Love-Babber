const employeegrade_master = require('../models/employeegradeSchema.js');
const employee_category = require('../models/employeecategorySchema.js'); 
const employee_document = require('../models/documentSchema.js'); 
const departmentSchema   = require('../models/departmentSchema.js');
const user_log = require('../models/user_log_Schema.js');
const moment = require('moment-timezone');
const { validationResult } = require('express-validator');
const XLSX = require('xlsx');
const mongoose = require('mongoose');

let employee_master = require('../models/employeeSchema');
let shift_master = require('../models/shiftSchema');
let designation_master = require('../models/designationSchema');
let leaveSchema = require('../models/leaveSchema.js');
let department_master = require('../models/department_master_Schema');
let branch_master = require('../models/branchSchema');
let machine_master = require('../models/machine_mast.js');
let city_master = require('../models/citySchema');
let bank_master = require('../models/bankSchema');
let esidispensary_master = require('../models/esiSchema');
let state_master = require('../models/stateSchema');
let salarystru_master = require('../models/salarystruSchema');
let salaryhead_master = require('../models/salaryhdSchema');
// exports.employeegrade_masterAdd = async (req, res) => {
//     try {
//         // const errors = validationResult(req);
//         // if (!errors.isEmpty()) {
//         //     console.log(errors.array());
//         //     return res.json({ 'status': false, 'message': 'Validation error', 'errors': errors.array() });
//         // }
//         const {description,code} = req.body;
//        const existingEmployeeGrade =  await employeegrade_master.findOne({discription:description})
//         if (existingEmployeeGrade) {
//             return res.json({ 'status': false, 'message': 'Employee grade master with this description already exists' });
//         }

//         const state_mast = new employeegrade_master()
//             state_mast.discription = description;
//             state_mast.code = code;
//             state_mast.user = req.body.user;
//             state_mast.masterid = req.body.masterid;
//             state_mast.co_code = req.body.compid;
//             state_mast.div_code = req.body.divid;
//             var state_mast_entry = new Date();
//             var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
//             var entrydatemilisecond = entryDateObject.format('x');
//             state_mast.entry = entryDateObject;
//             state_mast.entry_datemilisecond = entrydatemilisecond;
//             state_mast.del = 'N';

//         const savedEmployeeGrade = await state_mast.save();

//         const userLog = new user_log({
//             user_name: req.body.user,
//             module_name: 'Employee Grade Master',
//             user_op: 'A',
//             entry_id: savedEmployeeGrade._id,
//             entry_date: state_mast.entry,
//             entry_datemilisecond: state_mast.entry_datemilisecond
//         });

//         await userLog.save();

//         return res.json({ 'status': true, message:'Added successfully' });
//     } catch (error) {
//         console.log("error - ", error.message);
//         return res.status(500).json({ 'status': false, 'message': 'Internal server error' });
//     }
// };
exports.employeegrade_masterAdd = async (req, res) => {
    try {
        let state_mast = new employeegrade_master();
        state_mast.discription = req.body.description;
        state_mast.code = req.body.code;
      
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.format('x');
        state_mast.entry = entryDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await employeegrade_master.findOne({ discription: req.body.description });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id) {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }

            const newState = {
                discription : req.body.description,
                code : req.body.code,
                user: req.body.user,
                masterid: req.body.masterid,
                co_code: req.body.compid,
                div_code: req.body.divid,
                entry: moment().tz("Asia/Kolkata"), 
                entry_datemilisecond: Date.now(),
                del: 'N'
            };
            // Update existing salary head
            await employeegrade_master.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'Employee Grade Master';
            userLog.user_op = 'U';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await employeegrade_master.findOne({ discription: req.body.description });
            if (existingemployeegrade_master) {
                return res.json({ status: false, message: "Duplicate Description" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'Employee Grade Master';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};
exports.employeegrade_masterGET = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Page number (default: 1)
        const rowsPerPage = parseInt(req.query.rowsPerPage) || 10; // Rows per page (default: 10)

        const qry = { masterid: req.query.masterid, del: "N", co_code: req.query.compid };
        const regex = new RegExp(req.query.search, "i");
        let searchStr = {};
        if (isNaN(Number(req.query.search))) {
            searchStr = {
                $or: [
                    { 'description': regex },
                    { 'code': regex },
                ]
            };
        } else {
            searchStr = {
                $or: [
                    { 'description': regex },
                    { 'code': regex },
                ]
            };
        }

        if (Object.keys(searchStr).length > 0) {
            searchStr = Object.assign(searchStr, qry);
        } else {
            searchStr = qry;
        }
        console.log('qry',qry,searchStr)
        
        const lastEntryNo = await employeegrade_master.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { discription: "$discription", code: "$code" } }
        ]);
        const totalCount =lastEntryNo.length;
        
        console.log('lastEntryNo',totalCount,lastEntryNo)
        
        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.employeegrade_masterDELETE = async (req, res) => {
    console.log(req.params.id);
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: new Date(),
            del: 'Y'
        };

        // Update the document with the given _id
        await employeegrade_master.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'Employee Grade Master',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting employee grade:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.employeeTypeAdd = async (req, res) => {
    try {
        let state_mast = new employee_category();
        state_mast.discription = req.body.description;
        state_mast.code = req.body.code;
      
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.format('x');
        state_mast.entry = entryDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployee_category = await employee_category.findOne({ discription: req.body.description });

            if (existingemployee_category && existingemployee_category._id.toString() !== req.body._id) {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }

            const newState = {
                discription : req.body.description,
                code : req.body.code,
                user: req.body.user,
                masterid: req.body.masterid,
                co_code: req.body.compid,
                div_code: req.body.divid,
                entry: moment().tz("Asia/Kolkata"), 
                entry_datemilisecond: Date.now(),
                del: 'N'
            };
            await employee_category.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'Employee Type';
            userLog.user_op = 'U';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await employeegrade_master.findOne({ discription: req.body.description });
            if (existingemployeegrade_master) {
                return res.json({ status: false, message: "Duplicate Description" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'Employee Type';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};
exports.employeeTypeGET = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Page number (default: 1)
        const rowsPerPage = parseInt(req.query.rowsPerPage) || 10; // Rows per page (default: 10)

        const qry = { masterid: req.query.masterid, del: "N" };
        const regex = new RegExp(req.query.search, "i");
        let searchStr = {};
console.log(req.query)
        if (isNaN(Number(req.query.search))) {
            searchStr = {
                $or: [
                    { 'description': regex },
                    { 'code': regex },
                ]
            };
        } else {
            searchStr = {
                $or: [
                    { 'description': regex },
                    { 'code': regex },
                ]
            };
        }

        if (Object.keys(searchStr).length > 0) {
            searchStr = Object.assign(searchStr, qry);
        } else {
            searchStr = qry;
        }
        console.log('qry',qry,searchStr)
        
        const lastEntryNo = await employee_category.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { discription: "$discription", code: "$code" } }
        ]);
        const totalCount =lastEntryNo.length;
        
        console.log('lastEntryNo',totalCount,lastEntryNo)
        
        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.employeetypeDELETE = async (req, res) => {
    console.log(req.params.id);
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: new Date(),
            del: 'Y'
        };

        // Update the document with the given _id
        await employee_category.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'Employee Type',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting employee type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


///////document
exports.employeeDocumentAdd = async (req, res) => {
    try {
        let state_mast = new employee_document();
        state_mast.discription = req.body.description;
        state_mast.code = req.body.code;
      
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.format('x');
        state_mast.entry = entryDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployee_document = await employee_document.findOne({ discription: req.body.description });

            if (existingemployee_document && existingemployee_document._id.toString() !== req.body._id) {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }

            const newState = {
                discription : req.body.description,
                code : req.body.code,
                user: req.body.user,
                masterid: req.body.masterid,
                co_code: req.body.compid,
                div_code: req.body.divid,
                entry: moment().tz("Asia/Kolkata"), 
                entry_datemilisecond: Date.now(),
                del: 'N'
            };
            await employee_document.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'Employee Document';
            userLog.user_op = 'U';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await employeegrade_master.findOne({ discription: req.body.description });
            if (existingemployeegrade_master) {
                return res.json({ status: false, message: "Duplicate Description" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'Employee Document';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};
exports.employeeDocumentGET = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Page number (default: 1)
        const rowsPerPage = parseInt(req.query.rowsPerPage) || 10; // Rows per page (default: 10)

        const qry = { masterid: req.query.masterid, del: "N" };
        const regex = new RegExp(req.query.search, "i");
        let searchStr = {};
        if (isNaN(Number(req.query.search))) {
            searchStr = {
                $or: [
                    { 'description': regex },
                    { 'code': regex },
                ]
            };
        } else {
            searchStr = {
                $or: [
                    { 'description': regex },
                    { 'code': regex },
                ]
            };
        }

        if (Object.keys(searchStr).length > 0) {
            searchStr = Object.assign(searchStr, qry);
        } else {
            searchStr = qry;
        }
        console.log('qry',qry,searchStr)
        
        const lastEntryNo = await employee_document.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { discription: "$discription", code: "$code" } }
        ]);
        const totalCount =lastEntryNo.length;
        
        console.log('lastEntryNo',totalCount,lastEntryNo)
        
        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.employeeDocumentDELETE = async (req, res) => {
    console.log(req.params.id);
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: new Date(),
            del: 'Y'
        };

        // Update the document with the given _id
        await employee_document.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'Employee Document',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting employee Document:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.DocumentsGET = async (req, res) => {
    try {
        const lastEntryNo = await employee_document.aggregate([
            { $match: { masterid: req.body.masterid, del: "N" } },
            { $project: { discription: "$discription" } }
        ]);

       return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

//////////document closed
exports.ImportProfile = async (req, res, next) => {
    try {
        console.log("890",req.body.usrnm)
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }
            for (s = 0; s < step.length; s++) {
                var usrpwd=" ";
                var machine = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                var designation = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                var department = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                var SHIFT = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                var grade = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                var category = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                var branch = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                var work_place = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                var bank = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                var state_name = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                var city_name = new mongoose.Types.ObjectId('578df3efb618f5141202a196');

                 
                if (step[s] != undefined && step[s]["First Name"] != undefined) var first_name = step[s]["First Name"];
                if (step[s] != undefined && step[s]["Full Name"] != undefined) var full_name = step[s]["Full Name"];
                if (step[s] != undefined && step[s]["IFSC"] != undefined) var IFSC = step[s]["IFSC"];
                if (step[s] != undefined && step[s]["Last Name"] != undefined) var last_name = step[s]["Last Name"];
                if (step[s] != undefined && step[s]["Machine Code"] != undefined) var machine_code = step[s]["Machine Code"];
                // if (step[s] != undefined && step[s]["Machine"] != undefined) var machine = step[s]["Machine"];
                if (step[s] != undefined && step[s]["Gender"] != undefined) var gender = step[s]["Gender"];
                if (step[s] != undefined && step[s]["Father Name"] != undefined) var father_name = step[s]["Father Name"];
                if (step[s] != undefined && step[s]["Mother Name"] != undefined) var mother_name = step[s]["Mother Name"];
                if (step[s] != undefined && step[s]["Marital Status"] != undefined) var marital_status = step[s]["Marital Status"];
                if (step[s] != undefined && step[s]["Designation"] != undefined)  designation = await finddesignation(step[s]["Designation"].trim(), req);
                if (step[s] != undefined && step[s]["Machine"] != undefined) machine = await findmachine(step[s]["Machine"].trim(), req);                                
// -------------------------------
if (step[s] != undefined && step[s]["Blood Group"] != undefined) var bloodGroup =  step[s]["Blood Group"];                                
if (step[s] != undefined && step[s]["Salary Cycle"] != undefined) var salary_cycle =  step[s]["Salary Cycle"];                                
if (step[s] != undefined && step[s]["Reporting Manager"] != undefined) var reporting_manager =  step[s]["Reporting Manager"];                                
if (step[s] != undefined && step[s]["IFSC Code"] != undefined) var ifsc_code =  step[s]["IFSC Code"];                                
if (step[s] != undefined && step[s]["Name of Account Holderchine"] != undefined) var bank_acc_holder =  step[s]["Name of Account Holder"];                                
if (step[s] != undefined && step[s]["PT Eligible"] != undefined) var pt_application =  step[s]["PT Eligible"];                                
if (step[s] != undefined && step[s]["LWF Eligible"] != undefined) var lwf_application =  step[s]["LWF Eligible"];                                
if (step[s] != undefined && step[s]["EPS Eligible"] != undefined) var eps_application =  step[s]["EPS Eligible"];                                
if (step[s] != undefined && step[s]["EPS Joining Date"] != undefined) var EpsJoiningDate =  step[s]["EPS Joining Date"];                                
if (step[s] != undefined && step[s]["EPS Exit Date"] != undefined) var EpsExitDate =  step[s]["EPS Exit Date"];                                
if (step[s] != undefined && step[s]["HPS Eligible"] != undefined) var hps_application =  step[s]["HPS Eligible"];                                
if (step[s] != undefined && step[s]["PF Joining Date"] != undefined) var PfJoiningDate =  step[s]["PF Joining Date"];                                
if (step[s] != undefined && step[s]["Aayushman Card"] != undefined) var aayushman_card =  step[s]["Aayushman Card"];                                
if (step[s] != undefined && step[s]["Physically Challenged"] != undefined) var physicallyChallenged =  step[s]["Physically Challenged"];                                
if (step[s] != undefined && step[s]["House owner"] != undefined) var house_owner =  step[s]["House owner"];                                
if (step[s] != undefined && step[s]["Email"] != undefined) var email =  step[s]["Email"];                                
if (step[s] != undefined && step[s]["Emergency/ Alternate Contact No"] != undefined) var emergencyContact =  step[s]["Emergency/ Alternate Contact No"];                                
if (step[s] != undefined && step[s]["Salary Access"] != undefined) var salaryAccess =  step[s]["Salary Access"];                                
if (step[s] != undefined && step[s]["Password"] != undefined) usrpwd =  step[s]["Password"];                                

// ----------------------------------
                if (step[s] != undefined && step[s]["SHIFT"] != undefined) SHIFT = await findSHIFT(step[s]["SHIFT"].trim(), req);
                if (step[s] != undefined && step[s]["Sales Person"] != undefined) var sales_person = step[s]["Sales Person"];
                if (step[s] != undefined && step[s]["Department"] != undefined)  department = await finddepartment(step[s]["Department"].trim(), req);
                if (step[s] != undefined && step[s]["Birth Date"] != undefined) var birth_date = step[s]["Birth Date"];
                if (step[s] != undefined && step[s]["Joining"] != undefined) var joining = step[s]["Joining"];
                if (step[s] != undefined && step[s]["Grade"] != undefined)  grade = await findgrade(step[s]["Grade"].trim(), req);
                if (step[s] != undefined && step[s]["Salary From"] != undefined) var salary_from = step[s]["Salary From"];
                if (step[s] != undefined && step[s]["Category"] != undefined)  category = await findcategory(step[s]["Category"].trim(), req);
                if (step[s] != undefined && step[s]["Branch"] != undefined)  branch = await findbranch(step[s]["Branch"].trim(), req);
                if (step[s] != undefined && step[s]["Weekly Leave"] != undefined) var weekly_leave = step[s]["Weekly Leave"];
                if (step[s] != undefined && step[s]["Work Place"] != undefined)  work_place = await findworkplace(step[s]["Work Place"].trim(), req);
                if (step[s] != undefined && step[s]["Bank Name"] != undefined)  bank = await findbank(step[s]["Bank Name"].trim(), req);
                if (step[s] != undefined && step[s]["Salary Mode"] != undefined) var salary_mode = step[s]["Salary Mode"];
                if (step[s] != undefined && step[s]["PAN"] != undefined) var pan = step[s]["PAN"];
                if (step[s] != undefined && step[s]["Bank A/c No"] != undefined) var bank_ac_no = step[s]["Bank A/c No"];
                if (step[s] != undefined && step[s]["ESIC Dispensory"] != undefined) var dispensory = step[s]["ESIC Dispensory"];
                if (step[s] != undefined && step[s]["ESIC Applicable"] != undefined) var esi_applicable = step[s]["ESIC Applicable"];
                if (step[s] != undefined && step[s]["ESI Application No"] != undefined) var esi_applicable_no = step[s]["ESI Application No"];
                if (step[s] != undefined && step[s]["Effective From"] != undefined) var effective_from = step[s]["Effective From"];
                if (step[s] != undefined && step[s]["PF Applicable"] != undefined) var pf_application = step[s]["PF Applicable"];
                if (step[s] != undefined && step[s]["PF Application No"] != undefined) var pf_application_no = step[s]["PF Application No"];
                if (step[s] != undefined && step[s]["Aadhar No"] != undefined) var adhar_no = step[s]["Aadhar No"];
                if (step[s] != undefined && step[s]["UAN No"] != undefined) var uan_no = step[s]["UAN No"];
                if (step[s] != undefined && step[s]["Remarks"] != undefined) var remarks = step[s]["Remarks"];
                if (step[s] != undefined && step[s]["Applicable Division"] != undefined) var application_division = step[s]["Applicable Division"];
                if (step[s] != undefined && step[s]["Present Address"] != undefined) var present_address = step[s]["Present Address"];
                if (step[s] != undefined && step[s]["Address1"] != undefined) var address1 = step[s]["Address1"];
                if (step[s] != undefined && step[s]["City Name"] != undefined)  city_name = await findcityname(step[s]["City Name"].trim(), req);
                if (step[s] != undefined && step[s]["State Name"] != undefined)  state_name = await findstatename(step[s]["State Name"].trim(), req);
                if (step[s] != undefined && step[s]["Employee Reg No"] != undefined) var employee_reg_no = step[s]["Employee Reg No"];
                if (step[s] != undefined && step[s]["Emergency Contact/Alternate"] != undefined) var phone_no = step[s]["Emergency Contact/Alternate"]; 
                if (step[s] != undefined && step[s]["Mobile No"] != undefined) var mobile_no = step[s]["Mobile No"];
                if (step[s] != undefined && step[s]["Gross Salary"] != undefined) var gross_salary = step[s]["Gross Salary"];
                if (step[s] != undefined && step[s]["G Sal"] != undefined) var g_sal = step[s]["G Sal"];
                if (step[s] != undefined && step[s]["days"] != undefined) var days = step[s]["days"];
                if (step[s] != undefined && step[s]["OPLV"] != undefined) var OPLV = step[s]["OPLV"];
                if (step[s] != undefined && step[s]["OT(Y/N)"] != undefined) var ot = step[s]["OT(Y/N)"];
                if (step[s] != undefined && step[s]["bonus"] != undefined) var bonus = step[s]["bonus"];

                var loanremarks = "";
                if (step[s] != undefined && step[s]["Loan Date"] != undefined) var loandate = step[s]["Loan Date"];
                if (step[s] != undefined && step[s]["Loan Amount"] != undefined) var loanamount = step[s]["Loan Amount"];
                if (step[s] != undefined && step[s]["Loan Installment"] != undefined) var loaninstallment = step[s]["Loan Installment"];
                if (step[s] != undefined && step[s]["Loan Balance"] != undefined) var loanbalance = step[s]["Loan Balance"];
                if (step[s] != undefined && step[s]["Loan Remarks"] != undefined) loanremarks = step[s]["Loan Remarks"];



                var LoanDateObject = moment(loandate, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                var loandatemilisecond = LoanDateObject.format('x');

                var arr1 = {
                    loan_date: LoanDateObject,
                    loan_datemilisecond: loandatemilisecond,
                    loanamount: loanamount,
                    loaninstallment: loaninstallment,
                    loanbalance: loanbalance,
                    loanremarks: loanremarks,
                    loandc: 'D',
                }
                var loan_arr = [];
                if(loanamount>0) {
                    loan_arr.push(arr1)
                };

                if (machine == 0) {
                    let machine_mast = new machine_master();
                    machine_mast.machine_name = step[s]["Machine"].trim();
                    machine_mast.user = req.body.user;
                    machine_mast.masterid = req.body.masterid;
                    machine_mast.co_code = req.body.compid;
                    machine_mast.div_code = req.body.divid;
                    var machine_mast_entry = new Date();
                    var DateObject = moment(machine_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = DateObject.format('x');
                    machine_mast.entry = DateObject;
                    machine_mast.entry_datemilisecond = entrydatemilisecond;
                    machine_mast.del = 'N';
                    machine_mast.save()
                    machine = machine_mast._id;
                    
                }

                if (designation == 0) {
                    let designation_mast = new designation_master();
                    designation_mast.discription = step[s]["Designation"].trim();
                    designation_mast.user = req.body.user;
                    designation_mast.masterid = req.body.masterid;
                    designation_mast.co_code = req.body.compid;
                    designation_mast.div_code = req.body.divid;
                    var designation_mast_entry = new Date();
                    var DateObject = moment(designation_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = DateObject.format('x');
                    designation_mast.entry = DateObject;
                    designation_mast.entry_datemilisecond = entrydatemilisecond;
                    designation_mast.del = 'N';
                    designation_mast.save()
                    designation = designation_mast._id;
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'Designation Master';
                    userLog.user_op = 'A';
                    userLog.entry_id = designation_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    userLog.save()
                }

                if (department == 0) {

                    let department_mast = new departmentSchema();
                    department_mast.discription = step[s]["Department"].trim();
                    department_mast.user = req.body.user;
                    department_mast.masterid = req.body.masterid;
                    department_mast.co_code = req.body.compid;
                    department_mast.div_code = req.body.divid;
                    var department_mast_entry = new Date();
                    var DateObject = moment(department_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = DateObject.format('x');
                    department_mast.entry = DateObject;
                    department_mast.entry_datemilisecond = entrydatemilisecond;
                    department_mast.del = 'N';
                    department_mast.save()
                    department = department_mast._id;
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'Department Master';
                    userLog.user_op = 'A';
                    userLog.entry_id = department_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    userLog.save()
                }

                if (grade == 0) {
                    let grade_mast = new employeegrade_master();
                    grade_mast.discription = step[s]["Grade"].trim();
                    grade_mast.user = req.body.user;
                    grade_mast.masterid = req.body.masterid;
                    grade_mast.co_code = req.body.compid;
                    grade_mast.div_code = req.body.divid;
                    var grade_mast_entry = new Date();
                    var DateObject = moment(grade_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = DateObject.format('x');
                    grade_mast.entry = DateObject;
                    grade_mast.entry_datemilisecond = entrydatemilisecond;
                    grade_mast.del = 'N';
                    grade_mast.save()
                    grade = grade_mast._id;
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'Employee Grade Master';
                    userLog.user_op = 'A';
                    userLog.entry_id = grade_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    userLog.save()
                }

                if (category == 0) {
                    let category_mast = new employee_category();
                    category_mast.discription = step[s]["Category"].trim();
                    category_mast.user = req.body.user;
                    category_mast.masterid = req.body.masterid;
                    category_mast.co_code = req.body.compid;
                    category_mast.div_code = req.body.divid;
                    var category_mast_entry = new Date();
                    var DateObject = moment(category_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = DateObject.format('x');
                    category_mast.entry = DateObject;
                    category_mast.entry_datemilisecond = entrydatemilisecond;
                    category_mast.del = 'N';
                    category_mast.save()
                    category = category_mast._id;
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'Employee Category Master';
                    userLog.user_op = 'A';
                    userLog.entry_id = category_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    userLog.save()
                }

                if (branch == 0) {
                    let branch_mast = new branch_master();
                    branch_mast.discription = step[s]["Branch"].trim();
                    branch_mast.user = req.body.user;
                    branch_mast.masterid = req.body.masterid;
                    branch_mast.co_code = req.body.compid;
                    branch_mast.div_code = req.body.divid;
                    var branch_mast_entry = new Date();
                    var DateObject = moment(branch_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = DateObject.format('x');
                    branch_mast.entry = DateObject;
                    branch_mast.entry_datemilisecond = entrydatemilisecond;
                    branch_mast.del = 'N';
                    branch_mast.save()
                    branch = branch_mast._id;
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'Branch Master';
                    userLog.user_op = 'A';
                    userLog.entry_id = branch_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    userLog.save()
                }

                if (work_place == 0) {
                    let city_mast = new city_master();
                    city_mast.CityName = step[s]["Work Place"].trim();
                    city_mast.user = req.body.user;
                    city_mast.masterid = req.body.masterid;
                    city_mast.co_code = req.body.compid;
                    city_mast.div_code = req.body.divid;
                    var city_mast_entry = new Date();
                    var DateObject = moment(city_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = DateObject.format('x');
                    city_mast.entry = DateObject;
                    city_mast.entry_datemilisecond = entrydatemilisecond;
                    city_mast.del = 'N';
                    city_mast.save()
                    work_place = city_mast._id;
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'City Master';
                    userLog.user_op = 'A';
                    userLog.entry_id = city_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    userLog.save()
                }

                if (bank == 0) {
                    let bank_mast = new bank_master();
                    bank_mast.discription = step[s]["Bank Name"]?.trim();
                    bank_mast.user = req.body.user;
                    bank_mast.masterid = req.body.masterid;
                    bank_mast.co_code = req.body.compid;
                    bank_mast.div_code = req.body.divid;
                    var bank_mast_entry = new Date();
                    var DateObject = moment(bank_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = DateObject.format('x');
                    bank_mast.entry = DateObject;
                    bank_mast.entry_datemilisecond = entrydatemilisecond;
                    bank_mast.del = 'N';
                    bank_mast.save()
                    bank = bank_mast._id;
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'Bank Master';
                    userLog.user_op = 'A';
                    userLog.entry_id = bank_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    userLog.save()
                }

                if (dispensory == 0) {
                    let esidispensary_mast = new esidispensary_master();
                    esidispensary_mast.discription = step[s]["ESIC Dispensory"].trim();
                    esidispensary_mast.user = req.body.user;
                    esidispensary_mast.masterid = req.body.masterid;
                    esidispensary_mast.co_code = req.body.compid;
                    esidispensary_mast.div_code = req.body.divid;
                    var esidispensary_mast_entry = new Date();
                    var DateObject = moment(esidispensary_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = DateObject.format('x');
                    esidispensary_mast.entry = DateObject;
                    esidispensary_mast.entry_datemilisecond = entrydatemilisecond;
                    esidispensary_mast.del = 'N';
                    esidispensary_mast.save()
                    dispensory = esidispensary_mast._id;
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'ESI Dispensary Master';
                    userLog.user_op = 'A';
                    userLog.entry_id = esidispensary_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    userLog.save()
                }

                if (city_name == 0) {
                    let city_mast = new city_master();
                    city_mast.CityName = step[s]["City Name"].trim();
                    city_mast.user = req.body.user;
                    city_mast.masterid = req.body.masterid;
                    city_mast.co_code = req.body.compid;
                    city_mast.div_code = req.body.divid;
                    var city_mast_entry = new Date();
                    var DateObject = moment(city_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = DateObject.format('x');
                    city_mast.entry = DateObject;
                    city_mast.entry_datemilisecond = entrydatemilisecond;
                    city_mast.del = 'N';
                    city_mast.save()
                    city_name = city_mast._id;
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'City Master';
                    userLog.user_op = 'A';
                    userLog.entry_id = city_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    userLog.save()
                }

                if (state_name == 0) {
                    let state_mast = new state_master();
                    state_mast.StateName = step[s]["State Name"].trim();
                    state_mast.user = req.body.user;
                    state_mast.masterid = req.body.masterid;
                    state_mast.co_code = req.body.compid;
                    state_mast.div_code = req.body.divid;
                    var state_mast_entry = new Date();
                    var DateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = DateObject.format('x');
                    state_mast.entry = DateObject;
                    state_mast.entry_datemilisecond = entrydatemilisecond;
                    state_mast.del = 'N';
                    state_mast.save()
                    state_name = state_mast._id;
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'State Master';
                    userLog.user_op = 'A';
                    userLog.entry_id = state_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    userLog.save()
                }
                console.log(machine_code, loan_arr)

                var empmast = await employee_master.findOne({ machine_code: machine_code, masterid: req.body.masterid, del: "N" });
                if (empmast == null) {
                    let employee_import = new employee_master();
                    employee_import.first_name = first_name;
                    employee_import.last_name = last_name;
                    employee_import.full_name = full_name;// first_name.concat(" ", last_name);
                    employee_import.machine_code = machine_code;
                    employee_import.machine = machine;
                    employee_import.gender_radio = gender;
                    employee_import.father_name = father_name;
                    employee_import.mother_name = mother_name;
                    employee_import.marital_status = marital_status;
                    employee_import.designation = designation;
                    employee_import.machine = designation;
                    employee_import.sales_person = sales_person;
                    employee_import.default_shift = SHIFT;
                    employee_import.loangroup = loan_arr;
                    employee_import.department = department;
                    // ------------------------------
                    employee_import.bloodGroup = bloodGroup;
                    employee_import.salary_cycle  = salary_cycle ;
                    employee_import.reporting_manager = reporting_manager;
                    employee_import.ifsc_code = ifsc_code;
                    employee_import.bank_acc_holder = bank_acc_holder;
                    employee_import.pt_application = pt_application;
                    employee_import.lwf_application = lwf_application;
                    employee_import.eps_application = eps_application;
                    employee_import.EpsJoiningDate = EpsJoiningDate;
                    employee_import.EpsExitDate = EpsExitDate;
                    employee_import.hps_application = hps_application;
                    employee_import.PfJoiningDate = PfJoiningDate;
                    employee_import.aayushman_card = aayushman_card;
                    employee_import.physicallyChallenged = physicallyChallenged;
                    employee_import.house_owner = house_owner;
                    employee_import.email = email;        
                    employee_import.emergencyContact = emergencyContact;
                    employee_import.salaryAccess = salaryAccess;
                    employee_import.usrpwd = usrpwd;

                    // ---------------------------------
                    if (birth_date != undefined) {
                        var BirthObject = moment(birth_date, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                        var birthdatemilisecond = BirthObject.format('x');
                    }
                    employee_import.birth_date = BirthObject;
                    employee_import.birth_datemilisecond = birthdatemilisecond;
                    if (joining != undefined) {
                        var JoiningObject = moment(joining, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                        var joiningdatemilisecond = JoiningObject.format('x');
                    }
                    employee_import.joining = JoiningObject;
                    employee_import.joining_datemilisecond = joiningdatemilisecond;
                    employee_import.grade = grade;
                    if (salary_from != undefined) {
                        var SalaryObject = moment(salary_from, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                        var salarydatemilisecond = SalaryObject.format('x');
                    }
                    employee_import.salary_from = SalaryObject;
                    employee_import.salary_from_datemilisecond = salarydatemilisecond;
                    employee_import.category = category;
                    employee_import.branch = branch;
                    employee_import.ol_appl = ot;
                    employee_import.weekly_leave = weekly_leave;
                    employee_import.work_place = work_place;
                    employee_import.bank = bank;
                    employee_import.salary_mode = salary_mode;
                    employee_import.pan = pan;
                    employee_import.bonus = bonus;
                    employee_import.emi_per = OPLV;
                    employee_import.bank_ac_no = bank_ac_no;
                    employee_import.dispensory = dispensory;
                    employee_import.esi_applicable = esi_applicable;
                    employee_import.no1 = esi_applicable_no;
                    if (effective_from != undefined) {
                        var EffectiveObject = moment(effective_from, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                        var effectivedatemilisecond = EffectiveObject.format('x');
                    }
                    employee_import.effective_from = EffectiveObject;
                    employee_import.effectivefrom_datemilisecond = effectivedatemilisecond;
                    employee_import.pf_application = pf_application;
                    employee_import.no2 = pf_application_no;
                    employee_import.adhar_no = adhar_no;
                    employee_import.uan_no = uan_no;
                    employee_import.remarks = remarks;
                    employee_import.application_division = application_division;
                    employee_import.present_add = present_address;
                    employee_import.address = address1;
                    employee_import.city = city_name;
                    employee_import.state = state_name;
                    employee_import.employee_reg_no = employee_reg_no;
                    employee_import.phone_no = phone_no;
                    employee_import.mobile_no = mobile_no;
                    employee_import.days = days;
                    employee_import.gross_sal = gross_salary;
                    employee_import.g_sal = g_sal;
                    var employee_import_entry = new Date();
                    var DateObject = moment(employee_import_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = DateObject.format('x');
                    employee_import.entry = DateObject;
                    employee_import.entry_datemilisecond = entrydatemilisecond;
                    employee_import.user = req.body.user;
                    employee_import.masterid = req.body.masterid;
                    employee_import.co_code = req.body.compid;
                    employee_import.div_code = req.body.divid;
                    for (var i = 0; i < employee_import.salryhd_or_group.length; i++) {
                        if (employee_import.salryhd_or_group[i].salaryhead_name == '') employee_import.salryhd_or_group[i].salaryhead_name = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                    }
                    employee_import.del = "N";
                    await employee_import.save();

                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'employee Master';
                    userLog.user_op = 'Import Add';
                    userLog.entry_id = employee_import._id;

                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;

                    await userLog.save();
                } else {
                    let employee_import = {};
                    employee_import.first_name = first_name;
                    employee_import.last_name = last_name;
                    employee_import.full_name = full_name //first_name.concat(" ", last_name);
                    employee_import.machine_code = machine_code;
                    employee_import.machine = machine;
                    employee_import.gender_radio = gender;
                    employee_import.father_name = father_name;
                    employee_import.mother_name = mother_name;
                    employee_import.marital_status = marital_status;
                    employee_import.loangroup = loan_arr;
                    employee_import.designation = designation;
                    employee_import.sales_person = sales_person;
                    employee_import.default_shift = SHIFT;
                    employee_import.department = department;

                    // -----------------------------------
                    employee_import.bloodGroup = bloodGroup;
                    employee_import.salary_cycle  = salary_cycle ;
                    employee_import.reporting_manager = reporting_manager;
                    employee_import.ifsc_code = ifsc_code;
                    employee_import.bank_acc_holder = bank_acc_holder;
                    employee_import.pt_application = pt_application;
                    employee_import.lwf_application = lwf_application;
                    employee_import.eps_application = eps_application;
                    employee_import.EpsJoiningDate = EpsJoiningDate;
                    employee_import.EpsExitDate = EpsExitDate;
                    employee_import.hps_application = hps_application;
                    employee_import.PfJoiningDate = PfJoiningDate;
                    employee_import.aayushman_card = aayushman_card;
                    employee_import.physicallyChallenged = physicallyChallenged;
                    employee_import.house_owner = house_owner;
                    employee_import.email = email;        
                    employee_import.emergencyContact = emergencyContact;
                    employee_import.salaryAccess = salaryAccess;
                    employee_import.usrpwd = usrpwd;

                    // ------------------------------------
                    if (birth_date != undefined) {
                        var BirthObject = moment(birth_date, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                        var birthdatemilisecond = BirthObject.format('x');
                    }
                    employee_import.birth_date = BirthObject;
                    employee_import.birth_datemilisecond = birthdatemilisecond;
                    if (joining != undefined) {
                        var JoiningObject = moment(joining, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                        var joiningdatemilisecond = JoiningObject.format('x');
                    }
                    employee_import.joining = JoiningObject;
                    employee_import.joining_datemilisecond = joiningdatemilisecond;
                    employee_import.grade = grade;
                    if (salary_from != undefined) {
                        var SalaryObject = moment(salary_from, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                        var salarydatemilisecond = SalaryObject.format('x');
                    }
                    employee_import.salary_from = SalaryObject;
                    employee_import.salary_from_datemilisecond = salarydatemilisecond;
                    employee_import.category = category;
                    employee_import.branch = branch;
                    employee_import.ol_appl = ot;
                    employee_import.weekly_leave = weekly_leave;
                    employee_import.work_place = work_place;
                    employee_import.bank = bank;
                    employee_import.salary_mode = salary_mode;
                    employee_import.pan = pan;
                    employee_import.bonus = bonus;
                    employee_import.emi_per = OPLV;
                    employee_import.bank_ac_no = bank_ac_no;
                    employee_import.dispensory = dispensory;
                    employee_import.esi_applicable = esi_applicable;
                    employee_import.no1 = esi_applicable_no;
                    if (effective_from != undefined) {
                        var EffectiveObject = moment(effective_from, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                        var effectivedatemilisecond = EffectiveObject.format('x');
                    }
                    employee_import.effective_from = EffectiveObject;
                    employee_import.effectivefrom_datemilisecond = effectivedatemilisecond;
                    employee_import.pf_application = pf_application;
                    employee_import.no2 = pf_application_no;
                    employee_import.adhar_no = adhar_no;
                    employee_import.uan_no = uan_no;
                    employee_import.remarks = remarks;
                    employee_import.application_division = application_division;
                    employee_import.present_add = present_address;
                    employee_import.address = address1;
                    employee_import.city = city_name;
                    employee_import.state = state_name;
                    employee_import.employee_reg_no = employee_reg_no;
                    employee_import.phone_no = phone_no;
                    employee_import.mobile_no = mobile_no;
                    employee_import.days = days;
                    employee_import.gross_sal = gross_salary;
                    employee_import.g_sal = g_sal;
                    var employee_import_entry = new Date();
                    var DateObject = moment(employee_import_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = DateObject.format('x');
                    employee_import.entry = DateObject;
                    employee_import.entry_datemilisecond = entrydatemilisecond;
                    employee_import.user = req.body.user;
                    employee_import.masterid = req.body.masterid;
                    employee_import.co_code = req.body.compid;
                    employee_import.div_code = req.body.divid;

                    employee_import.del = "N";
                    var qry = { _id: empmast._id };
                    console.log(qry, employee_import)
                    await employee_master.updateOne(qry, employee_import);

                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'Employee Master';
                    userLog.user_op = 'Import Update';
                    userLog.entry_id = empmast._id;

                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;

                    await userLog.save();
                }
            }
        }
        return res.status(200).json({ status: true, message: 'Import Successful' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message,message: 'Internal server error' });
    }
}

exports.Department_Add = async (req, res) => {
    try {
        let state_mast = new departmentSchema();
        state_mast.discription = req.body.description;
        state_mast.code = req.body.code;
      
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.format('x');
        state_mast.entry = entryDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await departmentSchema.findOne({ discription: req.body.description });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id) {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }

            const newState = {
                discription : req.body.description,
                code : req.body.code,
                user: req.body.user,
                masterid: req.body.masterid,
                co_code: req.body.compid,
                div_code: req.body.divid,
                entry: moment().tz("Asia/Kolkata"), 
                entry_datemilisecond: Date.now(),
                del: 'N'
            };
            // Update existing salary head
            await departmentSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'Deparatment';
            userLog.user_op = 'U';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await departmentSchema.findOne({ discription: req.body.description });
            if (existingemployeegrade_master) {
                return res.json({ status: false, message: "Duplicate Description" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'Department';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};
exports.DepartmentGET = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Page number (default: 1)
        const rowsPerPage = parseInt(req.query.rowsPerPage) || 10; // Rows per page (default: 10)

        const qry = { masterid: req.query.masterid, co_code: req.query.compid, del: "N" };
        const regex = new RegExp(req.query.search, "i");
        let searchStr = {};
        if (isNaN(Number(req.query.search))) {
            searchStr = {
                $or: [
                    { 'description': regex },
                    { 'code': regex },
                ]
            };
        } else {
            searchStr = {
                $or: [
                    { 'description': regex },
                    { 'code': regex },
                ]
            };
        }

        if (Object.keys(searchStr).length > 0) {
            searchStr = Object.assign(searchStr, qry);
        } else {
            searchStr = qry;
        }
        
        const lastEntryNo = await departmentSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { discription: "$discription", code: "$code" } }
        ]);
        const totalCount =lastEntryNo.length;        
        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.DepartmentDELETE = async (req, res) => {
    console.log(req.params.id);
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: new Date(),
            del: 'Y'
        };

        // Update the document with the given _id
        await departmentSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'Employee Grade Master',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting employee grade:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.Designation_Add = async (req, res) => {
    try {
        console.log(req.body)
        let state_mast = new designation_master();
        state_mast.discription = req.body.description;
        state_mast.code = req.body.code;
      
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.format('x');
        state_mast.entry = entryDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await designation_master.findOne({ discription: req.body.description });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }

            const newState = {
                discription : req.body.description,
                code : req.body.code,
                user: req.body.user,
                masterid: req.body.masterid,
                co_code: req.body.compid,
                div_code: req.body.divid,
                entry: moment().tz("Asia/Kolkata"), 
                entry_datemilisecond: Date.now(),
                del: 'N'
            };
            // Update existing salary head
            await designation_master.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'designation_master';
            userLog.user_op = 'U';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await designation_master.findOne({ discription: req.body.description });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N' ) {
                return res.json({ status: false, message: "Duplicate Description" });
            }
            console.log("456",state_mast)
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'designation_master';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};
exports.DesignationGET = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Page number (default: 1)
        const rowsPerPage = parseInt(req.query.rowsPerPage) || 10; // Rows per page (default: 10)

        const qry = { masterid: req.query.masterid, co_code: req.query.compid, del: "N" };
        const regex = new RegExp(req.query.search, "i");
        let searchStr = {};
        if (isNaN(Number(req.query.search))) {
            searchStr = {
                $or: [
                    { 'discription': regex },
                    { 'code': regex },
                ]
            };
        } else {
            searchStr = {
                $or: [
                    { 'discription': regex },
                    { 'code': regex },
                ]
            };
        }

        if (Object.keys(searchStr).length > 0) {
            searchStr = Object.assign(searchStr, qry);
        } else {
            searchStr = qry;
        }
        
        const lastEntryNo = await designation_master.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { discription: "$discription", code: "$code" } }
        ]);
        const totalCount =lastEntryNo.length;
        
        
        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.DesignationDELETE = async (req, res) => {
    console.log(req.params.id);
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: new Date(),
            del: 'Y'
        };

        // Update the document with the given _id
        await designation_master.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'designation_master',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting designation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.LeaveTypes_Add = async (req, res) => {
    try {
        console.log(req.body)
        let state_mast = new leaveSchema();
        state_mast.discription = req.body.description;
        state_mast.code = req.body.code;
        state_mast.benifit_leave = req.body.benefitLeave;
        state_mast.day_count = req.body.dayCount;
        state_mast.yearly_nos = req.body.yearlyNos;

        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.format('x');
        state_mast.entry = entryDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await leaveSchema.findOne({ discription: req.body.description });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }

            const newState = {
                discription : req.body.description,
                code : req.body.code,
                benifit_leave : req.body.benefitLeave,
                day_count : req.body.dayCount,
                yearly_nos : req.body.yearlyNos,
                user: req.body.user,
                masterid: req.body.masterid,
                co_code: req.body.compid,
                div_code: req.body.divid,
                entry: moment().tz("Asia/Kolkata"), 
                entry_datemilisecond: Date.now(),
                del: 'N'
            };
            // Update existing salary head
            await leaveSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'leaveSchema';
            userLog.user_op = 'U';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await leaveSchema.findOne({ discription: req.body.description });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N' ) {
                return res.json({ status: false, message: "Duplicate Description" });
            }
            console.log("456",state_mast)
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'leaveSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.LeaveTypesGET = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Page number (default: 1)
        const rowsPerPage = parseInt(req.query.rowsPerPage) || 10; // Rows per page (default: 10)

        const qry = { masterid: req.query.masterid, co_code: req.query.compid, del: "N" };
        const regex = new RegExp(req.query.search, "i");
        let searchStr = {};
        if (isNaN(Number(req.query.search))) {
            searchStr = {
                $or: [
                    { 'discription': regex },
                    { 'code': regex },
                ]
            };
        } else {
            searchStr = {
                $or: [
                    { 'discription': regex },
                    { 'code': regex },
                ]
            };
        }

        if (Object.keys(searchStr).length > 0) {
            searchStr = Object.assign(searchStr, qry);
        } else {
            searchStr = qry;
        }
        
        const lastEntryNo = await leaveSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { discription: "$discription", code: "$code", benifit_leave:"$benifit_leave", day_count:"$day_count", yearly_nos:"$yearly_nos" } }
        ]);
        const totalCount =lastEntryNo.length;
        
        
        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.LeaveTypesDELETE = async (req, res) => {
    console.log(req.params.id);
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: new Date(),
            del: 'Y'
        };

        // Update the document with the given _id
        await leaveSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'leaveSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting designation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


function findmachine(cnm, req) {
    return new Promise(function (resolve, reject) {
        machine_master.findOne({ machine_name: cnm, masterid: req.body.masterid, del: 'N' })
            .then(function (machinemaster) {
                var obj = 0;
                if (machinemaster) {
                    obj = machinemaster._id;
                }
                resolve(obj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}


function finddesignation(cnm, req) {
    return new Promise(function (resolve, reject) {
        designation_master.findOne({ discription: cnm, masterid: req.body.masterid, del: 'N' })
            .then(function (designationmaster) {
                var obj = 0;
                if (designationmaster) {
                    obj = designationmaster._id;
                }
                resolve(obj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function findSHIFT(cnm, req) {
    return new Promise(function (resolve, reject) {
        shift_master.findOne({ shift_name: cnm, masterid: req.body.masterid, del: 'N' })
            .then(function (shiftmaster) {
                var obj = 0;
                if (shiftmaster) {
                    obj = shiftmaster._id;
                }
                resolve(obj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function finddepartment(cnm, req) {
    return new Promise(function (resolve, reject) {
        departmentSchema.findOne({ discription: cnm, masterid: req.body.masterid, del: 'N' })
            .then(function (departmentmaster) {
                var obj = 0;
                if (departmentmaster) {
                    obj = departmentmaster._id;
                }
                resolve(obj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function findgrade(cnm, req) {
    return new Promise(function (resolve, reject) {
        employeegrade_master.findOne({ discription: cnm, masterid: req.body.masterid, del: 'N' })
            .then(function (grademaster) {
                var obj = 0;
                if (grademaster) {
                    obj = grademaster._id;
                }
                resolve(obj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function findcategory(cnm, req) {
    return new Promise(function (resolve, reject) {
        employee_category.findOne({ discription: cnm, masterid: req.body.masterid, del: 'N' })
            .then(function (categorymaster) {
                var obj = 0;
                if (categorymaster) {
                    obj = categorymaster._id;
                }
                resolve(obj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function findbranch(cnm, req) {
    return new Promise(function (resolve, reject) {
        branch_master.findOne({ discription: cnm, masterid: req.body.masterid, del: 'N' })
            .then(function (branchmaster) {
                var obj = 0;
                if (branchmaster) {
                    obj = branchmaster._id;
                }
                resolve(obj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function findworkplace(cnm, req) {
    return new Promise(function (resolve, reject) {
        city_master.findOne({ CityName: cnm, masterid: req.body.masterid, del: 'N' })
            .then(function (citymaster) {
                var obj = 0;
                if (citymaster) {
                    obj = citymaster._id;
                }
                resolve(obj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function findbank(cnm, req) {
    return new Promise(function (resolve, reject) {
        bank_master.findOne({ discription: cnm, masterid: req.body.masterid, del: 'N' })
            .then(function (bankmaster) {
                var obj = 0;
                if (bankmaster) {
                    obj = bankmaster._id;
                }
                resolve(obj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function finddispensory(cnm, req) {
    return new Promise(function (resolve, reject) {
        esidispensary_master.findOne({ discription: cnm, masterid: req.body.masterid, del: 'N' })
            .then(function (esidispensarymaster) {
                var obj = 0;
                if (esidispensarymaster) {
                    obj = esidispensarymaster._id;
                }
                resolve(obj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function findcityname(cnm, req) {
    return new Promise(function (resolve, reject) {
        city_master.findOne({ CityName: cnm, masterid: req.body.masterid, del: 'N' })
            .then(function (cityname) {
                var obj = 0;
                if (cityname) {
                    obj = cityname._id;
                }
                resolve(obj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function findstatename(cnm, req) {
    return new Promise(function (resolve, reject) {
        state_master.findOne({ StateName: cnm, masterid: req.body.masterid, del: 'N' })
            .then(function (statename) {
                var obj = 0;
                if (statename) {
                    obj = statename._id;
                }
                resolve(obj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}


exports.ImportSalStruc = async (req, res, next) => {
    try {
        console.log("890",req.body.usrnm)
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }


            var docs = [];
            for (s = 0; s < step.length; s++) {
                console.log(s,step[s])
                if (step[s] != undefined && step[s]['Employee Name'] != undefined) var employee_name = step[s]['Employee Name'];
                if (step[s] != undefined && step[s]['Machine Code'] != undefined) var maccode = step[s]['Machine Code'];
                
                var salarystru_id = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                if (step[s] != undefined && step[s]['Salary Structure'] != undefined) {
                    var salarystru = await salarystru_master.findOne({ salarystru_name: step[s]['Salary Structure'].toString().trim() });
                    if (salarystru != null) salrdearystru_id = salarystru._id;
                }
                var salaryheadname_id = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                if (step[s] != undefined && step[s]['Salary Head Name'] != undefined) {
                    var salaryheadname = await salaryhead_master.findOne({ salaryhead_name: step[s]['Salary Head Name'].toString().trim() });
                    if (salaryheadname != null) salaryheadname_id = salaryheadname._id;
                }
                if (step[s] != undefined && step[s]['Symbol'] != undefined) var symbol = step[s]['Symbol'];
                else var symbol = "";
                if (step[s] != undefined && step[s]['Order'] != undefined) var order = step[s]['Order'];
                else var order = "";
                if (step[s] != undefined && step[s]['Calc Basis'] != undefined) var calc_basis = step[s]['Calc Basis'];
                else var calc_basis = "";
                if (step[s] != undefined && step[s]['Value'] != undefined) var value = step[s]['Value'];
                else var value = "";
                if (step[s] != undefined && step[s]['Round Off'] != undefined) var round_off = step[s]['Round Off'];
                else var round_off = "";
                if (step[s] != undefined && step[s]['Amount'] != undefined) var amount = step[s]['Amount'];
                else var amount = "";

                var employeemaster = await employee_master.findOne({ machine_code: maccode })
                if (employeemaster==null)
                {
                    var employeemaster = await employee_master.findOne({ full_name: employee_name })
                }

                
                console.log(maccode,step[s])
                if (employeemaster != null) {
                    var employee_id = employeemaster._id;
                    var gross_sal = employeemaster.gross_sal;

                    if (amount == "" && calc_basis == "% of Gross") {
                        var amount = parseFloat(gross_sal) * parseFloat(value) / 100;
                    }


                    var importsalaryhead = {};
                    importsalaryhead.full_name = employee_name;
                    importsalaryhead.salary_stru = salarystru_id;
                    docs = employeemaster.salryhd_or_group
                    var arr = {
                        salaryhead_name: salaryheadname_id,
                        salryhd_sign: symbol,
                        salryhd_odr: order,
                        salryhd_calcb: calc_basis,
                        salryhd_vlu: value,
                        salryhd_round: round_off,
                        amount: amount,
                    }
                    if (arr == null || arr == undefined || arr == '') flag = 1;
                    else docs.push(arr);

                    importsalaryhead.salryhd_or_group = docs;
                    importsalaryhead.entry = new Date();
                    importsalaryhead.del = "N";
                    importsalaryhead.user = req.body.user;
                    importsalaryhead.masterid = req.body.masterid;
                    importsalaryhead.co_code = req.body.compid;
                    importsalaryhead.div_code = req.body.divid;
                    let query = { _id: employee_id }
                    
                    
                    var  empupdate = await employee_master.findOneAndUpdate(query, importsalaryhead)
                    
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'Salary Structure Import';
                    userLog.user_op = 'Import Add';
                    userLog.entry_id = importsalaryhead._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    await userLog.save()
                    
                }
            }
        }
        return res.status(200).json({ status: true, message: 'Import Successful' });

    } catch (error) {
        return res.status(500).json({ error: error.message,message: 'Internal server error' });
    }
}