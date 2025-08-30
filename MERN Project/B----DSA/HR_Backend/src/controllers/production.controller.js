const user_log = require('../models/user_log_Schema.js');
const moment = require('moment-timezone');
const employeeschemas = require('../models/employeeSchema.js');
const departmentSchema = require('../models/department_master_Schema.js');
const ShiftSchema = require('../models/shiftSchema.js');
const employeecategorySchema = require('../models/employeecategorySchema.js');
const machineSchema = require('../models/machine_mast.js');

exports.DepartmentTypeGET = async (req, res) => {
    try {
        const lastEntryNo = await departmentSchema.aggregate([
            { $match: { masterid: req.body.masterid, co_code: req.body.compid, del: "N" } },
            { $project: { discription: "$description" } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.shiftGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, co_code: req.query.compid, div_code: req.query.divid, del: "N" };

        const shiftData = await ShiftSchema.find(qry)
            .select('shift_name total_hour')
            .exec();
        const CatData = await employeecategorySchema.find(qry)
            .select('discription')
            .exec();
        res.json({ status: true, shiftData, CatData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
};

exports.MachineMasterADD = async (req, res) => {
    try {
        let state_mast = new machineSchema();
        state_mast.machine_name = req.body.machine_name;
        state_mast.department = req.body.department;
        state_mast.machgroup = req.body.machgroup;
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

        const existingMachineReq = await machineSchema.findOne({ machine_name: req.body.machine_name });

        if (!existingMachineReq) {
            await state_mast.save();
            var userLog = new user_log();
            userLog.user_name = req.body.user;
            userLog.module_name = 'Machine Master';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.valueOf();
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();
            res.status(200).json({ status: true, message: 'Machine Requirments added successfully.' });
        } else {
            res.status(200).json({ status: false, message: 'Machine Name with the same name already exists.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: error.message });
    }
};

exports.MachineMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, co_code: req.query.compid, div_code: req.query.divid, del: "N" };
        // const qry = { masterid: req.query.masterid, del: "N" };
        console.log(qry)
        const shiftData = await machineSchema.find(qry)
            .populate({
                path: 'machgroup',
                match: { del: 'N' },
                populate: [
                    { path: 'shift', select: 'shift_name total_hour' },
                    { path: 'category', select: 'discription' }
                ]
            })
            .populate('department', 'description')
            .exec();

        res.json({ status: true, shiftData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
};

exports.MachineMasterDELETE = async (req, res) => {
    console.log(req.params.id);
    if (!req.params.id) {
        return res.status(400).json({ status: false, error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: new Date(),
            del: 'Y'
        };

        // Update the document with the given _id
        await machineSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'Machine Master',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Machine Master:', error);
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
};

exports.MachineMasterUpdate = async (req, res) => {
    try {
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry).tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.valueOf();
        const { _id, machgroup, department, machine_name, user } = req.body;

        const machine = await machineSchema.findById(_id);

        if (!machine) {
            return res.status(200).json({ status: false, message: "Machine not found" });
        }
        machine.machgroup = machgroup;
        machine.department = department;
        machine.machine_name = machine_name;

        await machine.save();

        // Log the user activity
        const userLog = new user_log({
            user_name: user,
            module_name: 'Machine Master',
            user_op: 'U',
            entry_id: _id,
            entry_date: entryDateObject
        });
        await userLog.save();

        res.status(200).json({ status: true, message: "Machine updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Server Error" });
    }
};




exports.MachineMasterEdit = async (req, res) => {
    try {
        let state_mast = new machineSchema();
        state_mast.machine_name = req.body.machine_name;
        state_mast.department = req.body.department;
        state_mast.machgroup = req.body.machgroup;
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

        const existingMachineReq = await machineSchema.findOne({ machine_name: req.body.machine_name });

        if (!existingMachineReq) {
            await state_mast.save();
            var userLog = new user_log();
            userLog.user_name = req.body.user;
            userLog.module_name = 'Machine Master';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.valueOf();
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();
            res.status(200).json({ status: true, message: 'Machine Requirments added successfully.' });
        } else {
            res.status(200).json({ status: false, message: 'Machine Name with the same name already exists.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: error.message });
    }
};
