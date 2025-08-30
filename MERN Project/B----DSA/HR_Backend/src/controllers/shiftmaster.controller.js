const ShiftSchema = require('../models/shiftSchema.js');

const user_log = require('../models/user_log_Schema.js');
const moment = require('moment-timezone');
const { validationResult } = require('express-validator');


exports.shiftAdd = async (req, res) => {
    try {
        let state_mast = new ShiftSchema();
        state_mast.shift_name = req.body.shift_name;
        state_mast.in_time = req.body.in_time;
        state_mast.out_time = req.body.out_time;
        state_mast.total_hour = req.body.total_hour;

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
                shift_name: req.body.shift_name,
                in_time: req.body.in_time,
                out_time: req.body.out_time,
                total_hour: req.body.total_hour,
                user: req.body.user,
                masterid: req.body.masterid,
                co_code: req.body.compid,
                div_code: req.body.divid,
                entry: moment().tz("Asia/Kolkata"),
                entry_datemilisecond: Date.now(),
                del: 'N'
            };
            // Update existing Shift
            await ShiftSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'Shift';
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
            userLog.module_name = 'Shift';
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
exports.shiftGET = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Page number (default: 1)
        const rowsPerPage = parseInt(req.query.rowsPerPage) || 10; // Rows per page (default: 10)

        const qry = { masterid: req.query.masterid, co_code: req.query.compid, del: "N" };
        const regex = new RegExp(req.query.search, "i");
        let searchStr = {};
        console.log(req.query)
        if (isNaN(Number(req.query.search))) {
            searchStr = {
                $or: [
                    { 'shift_name': regex },
                    { 'in_time': regex },
                    { 'out_time': regex },
                    { 'total_hour': regex },
                ]
            };
        } else {
            searchStr = {
                $or: [
                    { 'shift_name': regex },
                    { 'in_time': regex },
                    { 'out_time': regex },
                    { 'total_hour': regex },
                ]
            };
        }

        if (Object.keys(searchStr).length > 0) {
            searchStr = Object.assign(searchStr, qry);
        } else {
            searchStr = qry;
        }
        console.log('qry', qry, searchStr)
        const lastEntryNo = await ShiftSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage },
            { $project: { shift_name: "$shift_name", in_time: "$in_time", out_time: "$out_time", total_hour: "$total_hour" } }
        ]);
        const totalCount = lastEntryNo.length;

        console.log('lastEntryNo', totalCount, lastEntryNo)

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.shiftDELETE = async (req, res) => {
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
        await ShiftSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'shift',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting shift:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

