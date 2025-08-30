const ShiftSchema = require('../models/shiftSchema.js');
const security_right_schema = require('../models/security_right_schema.js');
const User = require('../models/user.model.js');
const autho_setup = require('../models/autho_setup.js');

const masterSchema = require('../models/masterSchema.js');

const Company = require('../models/company.model.js');
const DivSchema = require('../models/divSchema.js');
const mongoose = require('mongoose'); // Import mongoose
const user_log = require('../models/user_log_Schema.js');
const moment = require('moment-timezone');
const { validationResult } = require('express-validator');


exports.securityAdd = async (req, res) => {
    try {
        let state_mast = new security_right_schema();
        state_mast.sno = req.body.sno;
        state_mast.right_name = req.body.right_name;
        state_mast.right_desc = req.body.right_desc;

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
            // const existingemployeegrade_master = await employeegrade_master.findOne({ discription: req.body.description });

            // if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id) {
            //     return res.json({ status: false, message: "Duplicate Description Name" });
            // }

            const newState = {
                sno: req.body.sno,
                right_name: req.body.right_name,
                right_desc: req.body.right_desc,
                user: req.body.user,
                masterid: req.body.masterid,
                co_code: req.body.compid,
                div_code: req.body.divid,
                entry: moment().tz("Asia/Kolkata"),
                entry_datemilisecond: Date.now(),
                del: 'N'
            };
            // Update existing Shift
            await security_right_schema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'Security';
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
            // const existingemployeegrade_master = await employeegrade_master.findOne({ discription: req.body.description });
            // if (existingemployeegrade_master) {
            //     return res.json({ status: false, message: "Duplicate Description" });
            // }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'Security';
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

exports.Security_Auto_Add = async (req, res) => {
    try {
        // Extract the data to be inserted
        const data = [
            { sno: 1, right_name: "Dashboard", right_desc: "Dashboard" },
            { sno: 2, right_name: "Masters", right_desc: "Masters" },
            { sno: 3, right_name: "Customer Registration", right_desc: "Customer Registration" },
            { sno: 4, right_name: "Master Accounting", right_desc: "Master Accounting" },
            { sno: 5, right_name: "Group Master", right_desc: "Group Master" },
            { sno: 6, right_name: "Account Master", right_desc: "Account Master" },
            { sno: 7, right_name: "Group Setup Master", right_desc: "Group Setup Master" },
            { sno: 8, right_name: "Account Setup Master", right_desc: "Account Setup Master" },
            { sno: 9, right_name: "Others", right_desc: "Others" },
            { sno: 10, right_name: "State Master", right_desc: "State Master" },
            { sno: 11, right_name: "City Master", right_desc: "City Master" },
            { sno: 12, right_name: "Maintenance Master", right_desc: "Maintenance Master" },
            { sno: 13, right_name: "Make Master", right_desc: "Make Master" },
            { sno: 14, right_name: "Variant Master", right_desc: "Variant Master" },
            { sno: 15, right_name: "Model Master", right_desc: "Model Master" },
            { sno: 16, right_name: "Fuel Master", right_desc: "Fuel Master" },
            { sno: 17, right_name: "Document Master", right_desc: "Document Master" },
            { sno: 18, right_name: "Customer Category Master", right_desc: "Customer Category Master" },
            { sno: 19, right_name: "Customer Type Master", right_desc: "Customer Type Master" },
            { sno: 20, right_name: "Bank Master", right_desc: "Bank Master" },
            { sno: 21, right_name: "Expense Master", right_desc: "Expense Master" },
            { sno: 22, right_name: "Transection", right_desc: "Transection" },
            { sno: 23, right_name: "Customer Application", right_desc: "Customer Application" },
            { sno: 24, right_name: "Inquiry", right_desc: "Inquiry" },
            { sno: 25, right_name: "Payment", right_desc: "Payment" },
            { sno: 26, right_name: "Cash Bank", right_desc: "Cash Bank" },
            { sno: 27, right_name: "Journal Entry", right_desc: "Journal Entry" },
            { sno: 28, right_name: "Accounting", right_desc: "Accounting" },
            { sno: 29, right_name: "Ledger Report", right_desc: "Ledger Report" },
            { sno: 30, right_name: "Cash / Bank", right_desc: "Cash / Bank" },
            { sno: 31, right_name: "Trail Balance", right_desc: "Trail Balance" },
            { sno: 32, right_name: "Reports", right_desc: "Reports" },
            { sno: 33, right_name: "Disbursement Report", right_desc: "Disbursement Report" },
            { sno: 34, right_name: "Cancelled Report", right_desc: "Cancelled Report" },
            { sno: 35, right_name: "Reject Report", right_desc: "Reject Report" },
            { sno: 36, right_name: "Login Report", right_desc: "Login Report" },
            { sno: 37, right_name: "Bank Limit Report", right_desc: "Bank Limit Report" },
            { sno: 38, right_name: "Disbursement (EX) Report", right_desc: "Disbursement (EX) Report" },
            { sno: 39, right_name: "Tasks", right_desc: "Tasks" },
            { sno: 40, right_name: "Task Management", right_desc: "Task Management" },
            { sno: 41, right_name: "Task Plan", right_desc: "Task Plan" },
            { sno: 42, right_name: "User Rights", right_desc: "User Rights" },
            { sno: 43, right_name: "User List", right_desc: "User List" },
            { sno: 44, right_name: "Security", right_desc: "Security" },
            { sno: 45, right_name: "Authorization Setup", right_desc: "Authorization Setup" },
            { sno: 46, right_name: "Division Master", right_desc: "Division Master" },
            { sno: 47, right_name: "Company Master", right_desc: "Company Master" },
            { sno: 48, right_name: "Login Stage", right_desc: "Login Stage" },
            { sno: 49, right_name: "Soft Approval Stage", right_desc: "Soft Approval Stage" },
            { sno: 50, right_name: "Reject Stage", right_desc: "Reject Stage" },
            { sno: 51, right_name: "Cancelled Stage", right_desc: "Cancelled Stage" },
            { sno: 52, right_name: "Approved Stage", right_desc: "Approved Stage" },
            { sno: 53, right_name: "Under-Disbursement Stage", right_desc: "Under-Disbursement Stage" },
            { sno: 54, right_name: "Disbursement Stage", right_desc: "Disbursement Stage" },
            { sno: 55, right_name: "Document Center Stage", right_desc: "Document Center Stage" }
        ];
        

        // Iterate over the data array and insert each entry into the database if it doesn't already exist
        for (const item of data) {
            const newState = {
                sno: item.sno,
                co_code: req.body.compid,
                div_code: req.body.divid,
                right_name: item.right_name,
                right_desc: item.right_desc,
            };

            // Check if an entry with the same group and user already exists
            const existingGroup = await security_right_schema.findOne({
                right_name: newState.right_name,
                co_code: req.body.compid,
                div_code: req.body.divid,
            });

            if (!existingGroup) {
                // If it doesn't exist, insert the new entry into the database
                const createdEntry = await security_right_schema.create(newState);
            }
        }

        // Create a new user log entry
        const userLog = new user_log();
        userLog.user_name = req.body.user;
        userLog.module_name = 'security_right_schema';
        userLog.user_op = 'A';
        userLog.entry_id = req.body.user;
        const userLog_entry = new Date();
        const userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
        const entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Added successfully" });

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.securityGET = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Page number (default: 1)
        const rowsPerPage = parseInt(req.query.rowsPerPage) || 10; // Rows per page (default: 10)

        const qry = {
            co_code: req.query.compid,
            div_code: req.query.divid,
        };
        const regex = new RegExp(req.query.search, "i");
        let searchStr = {};
        console.log("876", req.query)
        if (isNaN(Number(req.query.search))) {
            searchStr = {
                $or: [
                    { 'sno': regex },
                    { 'right_name': regex },
                    { 'right_desc': regex },
                ]
            };
        } else {
            searchStr = {
                $or: [
                    { 'sno': regex },
                ]
            };
        }

        if (Object.keys(searchStr).length > 0) {
            searchStr = Object.assign(searchStr, qry);
        } else {
            searchStr = qry;
        }
        const lastEntryNo = await security_right_schema.aggregate([
            { $match: qry },
            // { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage },
            { $project: { sno: "$sno", right_name: "$right_name", right_desc: "$right_desc" } }
        ]);
        const totalCount = lastEntryNo.length;


        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.securityDELETE = async (req, res) => {
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
        await security_right_schema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'security',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting security:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.UsersGET = async (req, res) => {
    try {
        const qry = { masterid: new mongoose.Types.ObjectId(req.query.masterid) };
        console.log(qry)
        const lastEntryNo = await User.aggregate([
            { $match: qry },
            // { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage },
            { $project: { last_name: "$last_name", first_name: "$first_name", usrnm: "$usrnm", emailid: "$emailid", phone_num: "$phone_num" } }
        ]);
        const totalCount = lastEntryNo.length;

        console.log('lastEntryNo', totalCount, lastEntryNo)

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.UserDataGET = async (req, res) => {
    try {
        const qry = {
            // masterid: req.query.masterid,
            // co_code: req.query.compid,
            // div_code: req.query.divid,
            _id: new mongoose.Types.ObjectId(req.query.user)
        };
        console.log(qry)
        const userData = await User.findOne(qry);

        if (!userData) {
            return res.status(200).json({ error: 'User data not found' });
        }

        res.json({ user: userData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.AllrightsGET = async (req, res) => {
    try {
        const Division = await DivSchema.find({ masterid: req.query.masterid }, { div_mast: 1 });
        const companies = await Company.find({ masterid: req.query.masterid }, { com_name: 1 });
        const SecurityList = await security_right_schema.aggregate([
            {
                $match: {
                    co_code: req.query.compid,
                    div_code: req.query.divid,
                }
            },
            { $project: { sno: "$sno", right_name: "$right_name", right_desc: "$right_desc" } }
        ]);
        res.json({ Division, companies, SecurityList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.MasterGET = async (req, res) => {
    try {
        const lastEntryNo = await masterSchema.aggregate([
            { $match: {} },
            { $project: { custname: "$custname" } }
        ]);

        res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CompanyGET = async (req, res) => {
    try {
        const lastEntryNo = await Company.aggregate([
            { $match: { masterid: req.body.masterid } },
            { $project: { com_name: "$com_name" } }
        ]);

        res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.DivSchemaGET = async (req, res) => {
    try {
        const lastEntryNo = await DivSchema.aggregate([
            { $match: { masterid: req.body.masterid } },
            { $project: { div_mast: "$div_mast" } }
        ]);

        res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.UpdateUserDetails = async (req, res) => {
    try {
        if (req.body.key && req.body.key === "UserRights_ListUpdate") {
            const newState = {
                admin: req.body.admin,
            };
            await User.updateOne({ _id: req.body._id }, newState);
        }
        else {
            const newState = {
                usrnm: req.body.userName,
                usrpwd: req.body.password,
                user: req.body.email,

                first_name: req.body.firstName,
                last_name: req.body.lastName,
                phone_num: req.body.phoneNo,
                administrator: req.body.admin,
                details: req.body.moreDetails,
                masterid: req.body.master,
                co_code: req.body.companies,
                div_code: req.body.divisions,
            };
            console.log(newState)
            await User.updateOne({ _id: req.body._id }, newState);
        }
        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'User';
        userLog.user_op = 'U';
        userLog.entry_id = req.body._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Updated successfully" });


    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.AddUser = async (req, res) => {
    try {
        let state_mast = new User();
        state_mast.usrnm = req.body.userName;
        state_mast.usrpwd = req.body.password;
        state_mast.emailid = req.body.email;
        state_mast.first_name = req.body.firstName;
        state_mast.last_name = req.body.lastName;
        state_mast.phone_num = req.body.phoneNo;
        state_mast.administrator = req.body.admin;
        state_mast.details = req.body.moreDetails;
        state_mast.masterid = req.body.master;
        state_mast.co_code = req.body.checkedComps;
        state_mast.div_code = req.body.checkedDivisions;
        state_mast.admin = '';

        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry).tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.valueOf();
        state_mast.entry = entryDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        await state_mast.save();
        var userLog = new user_log();
        userLog.user_name = req.body.user;
        userLog.module_name = 'User';
        userLog.user_op = 'A';
        userLog.entry_id = state_mast._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.valueOf();
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();
        res.status(200).json({ status: true, message: 'User added successfully.' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: error.message });
    }
};

exports.user_rights_securityGET = async (req, res) => {
    try {
        const qry = { right_desc: "Y" };
        const lastEntryNo = await security_right_schema.aggregate([
            { $match: qry },
            { $project: { right_name: "$right_name" } }
        ]);
        res.json({ lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.user_rights_userGET = async (req, res) => {
    try {
        const qry = {};
        const lastEntryNo = await User.aggregate([
            { $match: qry },
            { $project: { usrnm: "$usrnm" } }
        ]);
        res.json({ lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.Addautho_setup = async (req, res) => {
    try {
        var existingAuthoSetup = await autho_setup.findOne({ module_name: req.body.module_name });
        if (!existingAuthoSetup) {
            let state_mast = new autho_setup();
            state_mast.module_name = req.body.module_name;
            state_mast.module_id = req.body.module_id;
            state_mast.rolesetup = req.body.rolesetup;
            state_mast.co_code = req.body.compid;
            state_mast.div_code = req.body.divid;
            state_mast.usrnm = req.body.user;
            var state_mast_entry = new Date();
            var entryDateObject = moment(state_mast_entry).tz("Asia/Kolkata");
            var entrydatemilisecond = entryDateObject.valueOf();
            state_mast.entry = entryDateObject;
            state_mast.entry_datemilisecond = entrydatemilisecond;
            state_mast.del = 'N';

            await state_mast.save();
            var userLog = new user_log();
            userLog.user_name = req.body.user;
            userLog.module_name = 'autho_setup';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.valueOf();
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();
            return res.status(200).json({ status: true, message: 'Updated successfully.' });
        }
        else {
            existingAuthoSetup.module_name = req.body.module_name;
            existingAuthoSetup.module_id = req.body.module_id;
            existingAuthoSetup.rolesetup = req.body.rolesetup;
            existingAuthoSetup.co_code = req.body.compid;
            existingAuthoSetup.div_code = req.body.divid;
            existingAuthoSetup.usrnm = req.body.user;

            await existingAuthoSetup.save();
            var userLog = new user_log();
            userLog.user_name = req.body.user;
            userLog.module_name = 'autho_setup';
            userLog.user_op = 'U';
            // userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.valueOf();
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();
            return res.status(200).json({ status: true, message: 'Updated successfully.' });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: error.message });
    }
};

exports.autho_setupGET = async (req, res) => {
    try {
        const qry = { module_id: new mongoose.Types.ObjectId(req.body.modalID) };
        // const lastEntryNo = await autho_setup.aggregate([
        //     { $match: qry },
        //     { $project: { rolesetup: "$rolesetup" } }
        // ]);
        const lastEntryNo = await autho_setup.findOne(qry);
        res.json({ lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.Company_Add = async (req, res) => {
    try {
        let state_mast = new Company();
        state_mast.com_name = req.body.companyName;
        state_mast.co_code = req.body.companyCode;
        state_mast.sdate = moment(req.body.StartDate).tz("Asia/Kolkata");
        state_mast.edate = moment(req.body.EndtDate).tz("Asia/Kolkata");
        state_mast.mast_nm = "A";
        state_mast.Dealer_miscsno = "A";
        state_mast.Q_T_K = "A";
        state_mast.__v = 0;
        state_mast.masterid = req.body.masterid;
        if (req.body._id) {
            const existingemployeegrade_master = await Company.findOne({ co_code: req.body.companyCode, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id) {
                return res.json({ status: false, message: "Duplicate Company Code" });
            }

            const newState = {
                com_name: req.body.companyName,
                co_code: req.body.companyCode,
                sdate: moment(req.body.StartDate).tz("Asia/Kolkata"),
                edate: moment(req.body.EndtDate).tz("Asia/Kolkata"),
            };
            // Update existing salary head
            await Company.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'companySchema';
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
            const existingemployeegrade_master = await Company.findOne({ co_code: req.body.companyCode, masterid: req.body.masterid });

            if (existingemployeegrade_master) {
                return res.json({ status: false, message: "Duplicate Company Code" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'companySchema';
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

exports.Company_masterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid };

        const lastEntryNo = await Company.aggregate([
            { $match: qry },
            { $sort: { sdate: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.Division_Add = async (req, res) => {
    try {
        let state_mast = new DivSchema();
        state_mast.div_mast = req.body.divisionName;
        state_mast.div_code = req.body.divisionCode;
        state_mast.masterid = req.body.masterid;
        if (req.body._id) {
            const existingemployeegrade_master = await DivSchema.findOne({ div_code: req.body.divisionCode, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id) {
                return res.json({ status: false, message: "Duplicate Division Code" });
            }

            const newState = {
                div_mast: req.body.divisionName,
                div_code: req.body.divisionCode,
            };
            // Update existing salary head
            await DivSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'DivSchema';
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
            const existingemployeegrade_master = await DivSchema.findOne({ div_code: req.body.divisionCode, masterid: req.body.masterid });

            if (existingemployeegrade_master) {
                return res.json({ status: false, message: "Duplicate Division Code" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'DivSchema';
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

exports.Division_masterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid };

        const lastEntryNo = await DivSchema.aggregate([
            { $match: qry },
            { $sort: { sdate: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};