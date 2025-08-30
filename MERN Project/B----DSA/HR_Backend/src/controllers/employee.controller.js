const user_log = require('../models/user_log_Schema.js');
const moment = require('moment-timezone');
const mongoose = require('mongoose'); // Import mongoose
const employeeschemas = require('../models/employeeSchema.js');
const departmentSchema = require('../models/department_master_Schema.js');
const designationSchema = require('../models/designationSchema.js');
// const CategorySchema = require('../models/CategorySchema.js');
const salaryhead_master = require('../models/salaryhdSchema.js');
const employee_category = require('../models/employeecategorySchema.js');
const salarystruschemas = require('../models/salarystruSchema.js');
const ShiftSchema = require('../models/shiftSchema.js');
const BankSchema = require('../models/bankSchema.js');
const machine_mast = require('../models/machine_mast.js');
const path = require('path');
const fs = require('fs');
const salary_schema = require('../models/salarySchema');

exports.AddEmployee = async (req, res) => {
    try {
        let state_mast = new employeeschemas();
        state_mast.salary_stru = req.body.salary_stru;
        state_mast.first_name = req.body.first_name;
        state_mast.last_name = req.body.last_name;
        state_mast.full_name = req.body.full_name;
        state_mast.mobile_no = req.body.mobile_no;
        state_mast.department = req.body.department;
        state_mast.category = req.body.category;
        state_mast.default_shift = req.body.default_shift;
        state_mast.machine_code = req.body.machine_code;
        state_mast.salryhd_or_group = req.body.salryhd_or_group;
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry).tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.valueOf();
        state_mast.entry = entryDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        await state_mast.save();
        var userLog = new user_log();
        userLog.user_name = req.body.user;
        userLog.module_name = 'Add Employee';
        userLog.user_op = 'A';
        userLog.entry_id = state_mast._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.valueOf();
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();
        res.status(200).json({ status: true, message: 'Employee added successfully.' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: error.message });
    }
};

exports.DepartmentTypeGET = async (req, res) => {
    try {
        const lastEntryNo = await departmentSchema.aggregate([
            { $match: { masterid: req.body.masterid, del: "N" } },
            { $project: { description: "$description" } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.salaryHeadGet = async (req, res) => {
    try {
        const getSalaryHeadData = async (salryhd_sign) => {
            const result = await salarystruschemas.aggregate([
                {
                    $match: {
                        salarystru_name: req.body.salarystru_name,
                        del: "N",
                        masterid: req.body.masterid
                    }
                },
                {
                    $unwind: "$salryhd_or_group"
                },
                {
                    $lookup: {
                        from: 'salaryhdSchema',
                        localField: 'salryhd_or_group.salaryhead_name',
                        foreignField: '_id',
                        as: 'salaryhdSchema'
                    }
                },
                {
                    $match: {
                        "salryhd_or_group.salryhd_sign": salryhd_sign
                    }
                },
                {
                    $project: {
                        _id: 0,
                        salaryhead_name: { $arrayElemAt: ["$salaryhdSchema.salaryhead_name", 0] },
                        head_type: "$salryhd_or_group.salryhd_sign",
                        calculation_basis: "$salryhd_or_group.salryhd_calcb",
                        round_of_zero: "$salryhd_or_group.salryhd_round",
                        order: "$salryhd_or_group.salryhd_odr",
                        value: "$salryhd_or_group.salryhd_vlu",
                        _id: "$salryhd_or_group._id"
                    }
                }
            ]);
            return result.map(data => ({
                salaryheadName: data.salaryhead_name,
                head_type: data.head_type,
                calculation_basis: data.calculation_basis,
                round_of_zero: data.round_of_zero,
                order: data.order,
                value: data.value,
                _id: data._id
            }));
        };

        const earnings = await getSalaryHeadData("+");
        const deductions = await getSalaryHeadData("-");
        const EC = await getSalaryHeadData("E");

        res.json({ status: true, earnings, deductions, EC });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
};

exports.EmployeeUpdate = async (req, res) => {
    try {
        const { _id, formData, user } = req.body;

        const employee = await employeeschemas.findById(_id);

        if (!employee) {
            return res.status(200).json({ status: false, message: "Employee not found" });
        }

        const state_mast_entry = new Date();
        const entryDateObject = moment(state_mast_entry).tz("Asia/Kolkata");
        const entrydatemilisecond = entryDateObject.valueOf();

        formData.update = entryDateObject;
        formData.update_datemilisecond = entrydatemilisecond;

        await employeeschemas.updateOne({ _id: _id }, { $set: formData });

        // Log the user activity
        const userLog = new user_log({
            user_name: user,
            module_name: 'Employee Master',
            user_op: 'U',
            entry_id: _id,
            entry_date: new Date()
        });
        await userLog.save();

        res.status(200).json({ status: true, message: "Employee updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Server Error" });
    }
};

exports.designationTypeGET = async (req, res) => {
    try {
        const lastEntryNo = await designationSchema.aggregate([
            { $match: { masterid: req.body.masterid, del: "N" } },
            { $project: { discription: "$discription" } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CatTypeGET = async (req, res) => {
    try {
        const lastEntryNo = await employee_category.aggregate([
            { $match: { masterid: req.body.masterid, del: "N" } },
            { $project: { discription: "$discription" } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.shiftGET = async (req, res) => {
    try {
        const lastEntryNo = await ShiftSchema.aggregate([
            { $match: { masterid: req.body.masterid, del: "N" } },
            { $project: { shift_name: "$shift_name" } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.BankGET = async (req, res) => {
    try {
        const lastEntryNo = await BankSchema.aggregate([
            { $match: { masterid: req.body.masterid, del: "N" } },
            { $project: { discription: "$discription" } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.machine_mastGET = async (req, res) => {
    try {
        const lastEntryNo = await machine_mast.aggregate([
            { $match: { masterid: req.body.masterid, del: "N" } },
            { $project: { machine_name: "$machine_name" } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.EmployeeDocumentsUpdate = async (req, res) => {
    try {
        console.log(req.body)
        const { _id, documents, user } = req.body;

        const employee = await employeeschemas.findById(_id);

        if (!employee) {
            return res.status(200).json({ status: false, message: "Employee not found" });
        }

        const state_mast_entry = new Date();
        const entryDateObject = moment(state_mast_entry).tz("Asia/Kolkata");
        const entrydatemilisecond = entryDateObject.valueOf();

        await employeeschemas.updateOne({ _id: _id }, { $set: { documents: documents } });

        // Log the user activity
        const userLog = new user_log({
            user_name: user,
            module_name: 'Employee Master',
            user_op: 'U',
            entry_id: _id,
            entry_date: new Date()
        });
        await userLog.save();

        res.status(200).json({ status: true, message: "Documents updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Server Error" });
    }
};

exports.EmployeeDocumentsGet = async (req, res) => {
    try {
        const qry = { _id: new mongoose.Types.ObjectId(req.body._id) };
        const document = await employeeschemas.findOne(qry, 'documents');
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const parsedDocuments = JSON.parse(document.documents);
        res.json({ documents: parsedDocuments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.EmpMasterFileDownload = async (req, res) => {
    try {
        const filename = "Employee Master Sheet.xlsx";
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename); // Adjusted path to locate the file in the uploads folder

        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                return res.status(404).send('File not found');
            }

            const readStream = fs.createReadStream(filePath);

            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            readStream.pipe(res);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.EmployeeSalaryHDGet = async (req, res) => {
    try {
        const qry = { _id: new mongoose.Types.ObjectId(req.body._id) };
        const salryhd_or_group = await employeeschemas.findOne(qry, 'salryhd_or_group gross_sal g_sal').populate('salryhd_or_group.salaryhead_name', 'salaryhead_name');

        res.json({ salryhd_or_group: salryhd_or_group || [] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.EmployeeSalaryHDUpdate = async (req, res) => {
    try {
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecondss = userDateObject.format('x');
        const { _id, user } = req.body;
        const formData = {};
        const employee = await employeeschemas.findById(_id);

        if (!employee) {
            return res.status(200).json({ status: false, message: "Employee not found" });
        }

        const state_mast_entry = new Date();
        const entryDateObject = moment(state_mast_entry).tz("Asia/Kolkata");
        const entrydatemilisecond = entryDateObject.valueOf();

        formData.update = entryDateObject;
        formData.update_datemilisecond = entrydatemilisecond;
        formData.g_sal = req.body.Gsal;
        formData.gross_sal = req.body.GrossSal;
        formData.salryhd_or_group = req.body.salryhd_or_group;

        await employeeschemas.updateOne({ _id: _id }, { $set: formData });

        // Log the user activity
        const userLog = new user_log({
            user_name: user,
            module_name: 'employeeschemas',
            user_op: 'U',
            entry_id: _id,
            entry_date: userDateObject,
            entry_datemilisecond: entrydatemilisecondss
        });
        await userLog.save();

        res.status(200).json({ status: true, message: "Employee's salary structre updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Server Error" });
    }
};

exports.EmployeeLoanGet = async (req, res) => {
    try {
        const qry = { _id: new mongoose.Types.ObjectId(req.body._id) };
        const loangroup = await employeeschemas.findOne(qry, 'loangroup ');
        res.json({ loangroup: loangroup || [] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.EmployeeLoanUpdate = async (req, res) => {
    try {
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        const data = req.body.loanGroup;
        let loangroup = []
        for (const item of data) {
            try {
                let loangroupObj = {};
                loangroupObj.loan_date = moment(item.loan_date).tz("Asia/Kolkata");
                loangroupObj.loan_datemilisecond = moment(item.loan_date).tz("Asia/Kolkata").format('x');
                loangroupObj.loanremarks = item.loanremarks;
                loangroupObj.loandc = item.loandc;
                loangroupObj.loanamount = item.loanamount;
                loangroupObj.loaninstallment = item.loaninstallment;
                loangroupObj.loanbalance = item.loanbalance;
                loangroupObj._id = item._id;
                loangroup.push(loangroupObj);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        await employeeschemas.updateOne({ _id: req.body._id }, { $set: { loangroup: loangroup, update: userDateObject, update_datemilisecond: entrydatemilisecond } })

        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'employeeschemas';
        userLog.user_op = 'U';
        userLog.entry_id = req.body._id;
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Loan updated successfully" });
    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.EmployeeLeavesGet = async (req, res) => {
    try {
        const qry = { employee: new mongoose.Types.ObjectId(req.body._id), del:"N" };
        const leave = await salary_schema
            .find(qry)
            .select('leave_or_group month') // Select only leave_or_group and month fields
            .populate({
                path: 'leave_or_group.leave_name',
                model: 'leaveSchema',
            });
        
        res.json({ leave: leave || {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
