const salaryhead_master = require('../models/salaryhdSchema.js');
const user_log = require('../models/user_log_Schema.js');
const moment = require('moment-timezone');
const employee_category = require('../models/employeecategorySchema.js');
const salarystru_master = require('../models/salarystruSchema');

exports.Add_Salary_Head = async (req, res) => {
    try {
        let state_mast = new salaryhead_master();
        state_mast.salaryhead_name = req.body.salaryhead_name;
        state_mast.head_type = req.body.head_type;
        state_mast.max_limit = req.body.max_limit;
        state_mast.calculation_basis = req.body.calculation_basis;
        state_mast.value = req.body.value;
        state_mast.per_of_field = req.body.per_of_field;
        state_mast.round_of_zero = req.body.round_of_zero;
        state_mast.order = req.body.order;

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
            const existingSalaryHead = await salaryhead_master.findOne({ salaryhead_name: req.body.salaryhead_name });

            if (existingSalaryHead && existingSalaryHead._id.toString() !== req.body._id  && existingSalaryHead.del === 'N' ) {
                return res.json({ status: false, message: "Duplicate Head Name" });
            }
            const newState = {
                salaryhead_name: req.body.salaryhead_name,
                head_type: req.body.head_type,
                max_limit: req.body.max_limit,
                calculation_basis: req.body.calculation_basis,
                value: req.body.value,
                per_of_field: req.body.per_of_field,
                round_of_zero: req.body.round_of_zero,
                order: req.body.order,
                user: req.body.user,
                masterid: req.body.masterid,
                co_code: req.body.compid,
                div_code: req.body.divid,
                entry: moment().tz("Asia/Kolkata"), 
                entry_datemilisecond: Date.now(),
                del: 'N'
            };
            // Update existing salary head
            await salaryhead_master.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'Salary Head Master';
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
            const existingSalaryHead = await salaryhead_master.findOne({ salaryhead_name: req.body.salaryhead_name });
            if (existingSalaryHead && existingSalaryHead.del === 'N' ) {
                return res.json({ status: false, message: "Duplicate Head Name" });
            }
            // Save new salary head
            await state_mast.save();

            // Log the operation
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'Salary Head Master';
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

exports.salary_headListGET = async (req, res) => {
    try {
        const page = parseInt(req.query.currentPage) || 1; // Page number (default: 1)
        const rowsPerPage = parseInt(req.query.rowsPerPage) || 10; // Rows per page (default: 10)
        console.log(req.query.currentPage, "[[[[[[[[[[", page)
        const qry = { masterid: req.query.masterid, del: "N" };
        const regex = new RegExp(req.query.search, "i");
        let searchStr = {};
        if (isNaN(Number(req.query.search))) {
            searchStr = {
                $or: [
                    { 'salaryhead_name': regex },
                    { 'head_type': regex },
                    { 'max_limit': regex },
                    { 'calculation_basis': regex },
                    { 'value': regex },
                    { 'per_of_field': regex },
                    { 'round_of_zero': regex },
                    { 'order': regex },
                ]
            };
        } else {
            searchStr = {
                $or: [
                    { 'salaryhead_name': regex },
                    { 'head_type': regex },
                    { 'max_limit': regex },
                    { 'calculation_basis': regex },
                    { 'value': regex },
                    { 'per_of_field': regex },
                    { 'round_of_zero': regex },
                    { 'order': regex },
                ]
            };
        }

        if (Object.keys(searchStr).length > 0) {
            searchStr = Object.assign(searchStr, qry);
        } else {
            searchStr = qry;
        }

        const lastEntryNo = await salaryhead_master.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage },
            // { $project: { discription: "$discription", code: "$code" } }
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.salary_headDELETE = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: new Date(),
            del: 'Y'
        };

        // Update the document with the given _id
        await salaryhead_master.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'Employee Salary Master',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting salary head:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.salaryHeadGet = async (req, res) => {
    try {
        const salaryHdEarnings = await salaryhead_master.find({ head_type: "+", del: "N", masterid: req.body.masterid }, { _id: 1, salaryhead_name: 1,head_type:1,calculation_basis:1,round_of_zero:1,order:1 });
        const formattedEarnings = salaryHdEarnings.map(entry => ({
            _id: entry._id,
            salaryheadName: entry.salaryhead_name,
            head_type: entry.head_type,
            calculation_basis: entry.calculation_basis,
            round_of_zero: entry.round_of_zero,
            order: entry.order
        }));
        const salaryHdDeductions = await salaryhead_master.find({ head_type: "-", del: "N" , masterid: req.body.masterid}, { _id: 1, salaryhead_name: 1,head_type:1,calculation_basis:1,round_of_zero:1,order:1 });
        const formattedDeductions = salaryHdDeductions.map(entry => ({
            _id: entry._id,
            salaryheadName: entry.salaryhead_name,
            head_type: entry.head_type,
            calculation_basis: entry.calculation_basis,
            round_of_zero: entry.round_of_zero,
            order: entry.order
        }));
        const salaryHdEmployeeContri = await salaryhead_master.find({ head_type: "E", del: "N", masterid: req.body.masterid }, { _id: 1, salaryhead_name: 1,head_type:1,calculation_basis:1,round_of_zero:1,order:1 });
        const formattedEmployeeContri = salaryHdEmployeeContri.map(entry => ({
            _id: entry._id,
            salaryheadName: entry.salaryhead_name,
            head_type: entry.head_type,
            calculation_basis: entry.calculation_basis,
            round_of_zero: entry.round_of_zero,
            order: entry.order
        }));
        const salaryHdStaffType = await employee_category.find({del: "N", masterid: req.body.masterid}, { _id: 1, discription: 1,});
        const formattedStaffType = salaryHdStaffType.map(entry => ({
            _id: entry._id,
            staff_type: entry.discription
        }));

        res.json({ status: true, earnings: formattedEarnings, deductions: formattedDeductions, EC: formattedEmployeeContri, staff_type:formattedStaffType });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
};

exports.salaryStrucADD = async (req, res) => {
    try {
        let state_mast = new salarystru_master();
        state_mast.salarystru_name = req.body.salarystru_name;
        state_mast.gratutity = req.body.gratutity;
        state_mast.bonus = req.body.bonus;
        state_mast.remarks = req.body.remarks;
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

        const existingSalaryStructure = await salarystru_master.findOne({ salarystru_name: req.body.salarystru_name });

        if (existingSalaryStructure && existingSalaryStructure.del === 'N') {
            return res.status(400).json({ status: false, message: 'Salary structure with the same name already exists.' });
        } else {
            await state_mast.save();
            var userLog = new user_log();
            userLog.user_name = req.body.user;
            userLog.module_name = 'Salary Structure Master';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.valueOf();
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();
            return res.status(200).json({ status: true, message: 'Salary structure added successfully.' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

exports.salary_strucListGET = async (req, res) => {
    try {
        const page = parseInt(req.query.currentPage) || 1; // Page number (default: 1)
        const rowsPerPage = parseInt(req.query.rowsPerPage) || 10; // Rows per page (default: 10)
        const qry = { masterid: req.query.masterid, co_code: req.query.compid, del: "N" };
        const regex = new RegExp(req.query.search, "i");
        let searchStr = {};
        if (isNaN(Number(req.query.search))) {
            searchStr = {
                $or: [
                    { 'salarystru_name': regex },
                    { 'gratutity': regex },
                    { 'bonus': regex },
                    { 'remarks': regex },
                ]
            };
        } else {
            searchStr = {
                $or: [
                    { 'salarystru_name': regex },
                    { 'gratutity': regex },
                    { 'bonus': regex },
                    { 'remarks': regex },
                ]
            };
        }

        if (Object.keys(searchStr).length > 0) {
            searchStr = Object.assign(searchStr, qry);
        } else {
            searchStr = qry;
        }

        const lastEntryNo = await salarystru_master.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage },
            { $project: { salarystru_name: "$salarystru_name", gratutity: "$gratutity",bonus:"$bonus",remarks:"$remarks" } }
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.salary_StrucDELETE = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: new Date(),
            del: 'Y'
        };

        await salarystru_master.updateOne({ _id: req.params.id }, state_mast);

        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'Employee Salary Master',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting salary head:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.salary_strucEditData = async (req, res) => {
    try {
if(!req.body._id){
    return res.status(500).json({ success: false, message: 'No id' });
}   
     const SalaryStructure = await salarystru_master.findOne({ _id: req.body._id }).populate("salryhd_or_group.salaryhead_name", "salaryhead_name");;

        if (!SalaryStructure) {
            return res.status(404).json({ success: false, message: "Salary structure not found" });
        }
        res.status(200).json({ success: true, data: SalaryStructure });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

exports.salaryStrucUpdate = async (req, res) => {
    try {
        const newState = {
            salarystru_name: req.body.salarystru_name,
            gratutity: req.body.gratutity,
            bonus: req.body.bonus,
            remarks: req.body.remarks,
            salryhd_or_group: req.body.salryhd_or_group,
            user: req.body.user,
            masterid: req.body.masterid,
            co_code: req.body.compid,
            salCalBy: req.body.salCalBy,
            staff_type: req.body.staff_type,
            div_code: req.body.divid,
            entry: moment().tz("Asia/Kolkata"), 
            entry_datemilisecond: Date.now(),
            del: 'N'
        };

        const existingSalaryStructure = await salarystru_master.findOne({ salarystru_name: req.body.salarystru_name });

            if (existingSalaryStructure && existingSalaryStructure._id.toString() !== req.body.editID && existingSalaryStructure.del === 'N') {
                return res.json({ status: false, message: "Duplicate Head Name" });
            }

            await salarystru_master.updateOne({ _id: req.body.editID }, newState);

            var userLog = new user_log();
            userLog.user_name = req.body.user;
            userLog.module_name = 'Salary Structure Master';
            userLog.user_op = 'U';
            userLog.entry_id = req.body.entryID;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.valueOf();
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();
            res.status(200).json({ status: true, message: 'Salary structure Updated successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: error.message });
    }
};


