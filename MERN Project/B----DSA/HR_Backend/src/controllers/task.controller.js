const taskSchema = require('../models/taskSchema.js');
const task_managerSchema = require('../models/task_managerSchema.js');
const mailService = require('../controllers/common.js')
const employeeschemas = require('../models/employeeSchema.js');
const mongoose = require('mongoose'); // Import mongoose

const user_log = require('../models/user_log_Schema.js');
const moment = require('moment-timezone');
const { validationResult } = require('express-validator');

exports.TaskAdd = async (req, res) => {
    try {
        let state_mast = new taskSchema();
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
            const existingemployee_document = await taskSchema.findOne({ discription: req.body.description });

            if (existingemployee_document && existingemployee_document._id.toString() !== req.body._id) {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }

            const newState = {
                discription: req.body.description,
                code: req.body.code,
                user: req.body.user,
                masterid: req.body.masterid,
                co_code: req.body.compid,
                div_code: req.body.divid,
                entry: moment().tz("Asia/Kolkata"),
                entry_datemilisecond: Date.now(),
                del: 'N'
            };
            await taskSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'taskSchema';
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
            const existingtaskSchema = await taskSchema.findOne({ discription: req.body.description });
            if (existingtaskSchema) {
                return res.json({ status: false, message: "Duplicate Description" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'taskSchema';
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
exports.TaskGET = async (req, res) => {
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
        console.log('qry', qry, searchStr)

        const lastEntryNo = await taskSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { discription: "$discription", code: "$code" } }
        ]);
        const totalCount = lastEntryNo.length;

        console.log('lastEntryNo', totalCount, lastEntryNo)

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.TaskDELETE = async (req, res) => {
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
        await taskSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'taskSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.PriorityGET = async (req, res) => {
    try {
        const lastEntryNo = await taskSchema.aggregate([
            { $match: { masterid: req.body.masterid, del: "N" } },
            { $project: { discription: "$discription" } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.TaskPlanAdd = async (req, res) => {
    try {
        const maxVoucCodeEntry = await task_managerSchema.findOne({}, { vouc_code: 1 }).sort({ vouc_code: -1 }).limit(1);
        const maxVoucCode = maxVoucCodeEntry ? maxVoucCodeEntry.vouc_code : 0;

        let state_mast = new task_managerSchema();
        state_mast.main_bk = "Task";
        state_mast.c_j_s_p = "TaskPlan";
        state_mast.vouc_code = maxVoucCode + 1;
        state_mast.date = moment(req.body.startdate).tz("Asia/Kolkata");
        state_mast.datemilisecond = moment(req.body.startdate).tz("Asia/Kolkata").format('x');
        state_mast.task_name = req.body.planName;
        state_mast.duedate = moment(req.body.targetdate).tz("Asia/Kolkata");
        state_mast.duedatemilisecond = moment(req.body.targetdate).tz("Asia/Kolkata").format('x');
        state_mast.task_description = req.body.remarks;
        state_mast.task_priority = req.body.priority;
        state_mast.task_status = req.body.status;

        state_mast.usrnm = req.body.usrnm;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.format('x');
        state_mast.entrydate = entryDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        await state_mast.save();
        var userLog = new user_log;
        userLog.user_name = req.body.usrnm;
        userLog.module_name = 'task_managerSchema';
        userLog.user_op = 'A';
        userLog.entry_id = state_mast._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Plan Added successfully" });

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.GettasksDetails = async (req, res) => {
    try {
        const qry = { div_code: req.body.divid, co_code: req.body.compid, masterid: req.body.masterid, usrnm: req.body.usrnm, del: "N", };

        const summary = await task_managerSchema.aggregate([
            { $match: qry },
            { $sort: { entrydate: -1 } },
            {
                $lookup: {
                    from: 'taskSchema',
                    localField: 'task_priority',
                    foreignField: '_id',
                    as: 'taskSchema'
                }
            },
            {
                $lookup: {
                    from: 'employeeschemas',
                    localField: 'task_employee',
                    foreignField: '_id',
                    as: 'employeeschemas'
                }
            },
            {
                $group: {
                    _id: {
                        id: "$_id",
                        task_name: "$task_name",
                        task_description: "$task_description",
                        startdate: "$date",
                        duedate: "$duedate",
                        task_priority: "$taskSchema.discription",
                        task_status: "$task_status",
                        entrydate: "$entrydate",
                        main_bk: "$main_bk",
                        c_j_s_p: "$c_j_s_p",
                        vouc_code: "$vouc_code",
                        usrnm: "$usrnm",
                        filenames: "$filename",
                        empName: "$employeeschemas.full_name"
                    },
                }
            }
        ]);

        res.json({ success: true, summary, });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.TaskAssigneAdd = async (req, res) => {
    try {
        const files = req.files;
        let filenames;
        let filePaths;
        if (!files) {
            console.log('No files were uploaded.');
        } else {
            filenames = files.map(file => file.filename);
            filePaths = files.map(file => file.path);
        }

        let state_mast = new task_managerSchema();
        state_mast.main_bk = "Task";
        state_mast.c_j_s_p = "TaskAssign";
        state_mast.vouc_code = req.body.VouCode;
        state_mast.date = moment(req.body.startDate).tz("Asia/Kolkata");
        state_mast.datemilisecond = moment(req.body.startDate).tz("Asia/Kolkata").format('x');
        state_mast.task_name = req.body.planName;
        state_mast.duedate = moment(req.body.targetDate).tz("Asia/Kolkata");
        state_mast.duedatemilisecond = moment(req.body.targetDate).tz("Asia/Kolkata").format('x');
        state_mast.task_description = req.body.taskDesc;
        state_mast.task_priority = req.body.priority;
        state_mast.task_status = "Pending";
        state_mast.task_employee = req.body.task_employee;
        state_mast.filename = filenames ? filenames : [];
        state_mast.filepath = filePaths ? filePaths : [];

        state_mast.usrnm = req.body.usrnm;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.format('x');
        state_mast.entrydate = entryDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        await state_mast.save();
        const data = await employeeschemas.findOne({ _id: new mongoose.Types.ObjectId(req.body.task_employee) });


        const sendEmail = await mailService.sendTaskMail(data, state_mast,)
        var userLog = new user_log;
        userLog.user_name = req.body.usrnm;
        userLog.module_name = 'task_managerSchema';
        userLog.user_op = 'A';
        userLog.entry_id = state_mast._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Assignee Added successfully" });

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.GetEmployeeTasksDetails = async (req, res) => {
    try {
        const qry = { div_code: req.body.divid, co_code: req.body.compid, task_employee: new mongoose.Types.ObjectId(req.body.task_employee), del: "N", };
        if (!req.body.type) {
            qry.task_status = { $ne: 'Done' };
        }       
        console.log(qry)
        const summary = await task_managerSchema.aggregate([
            { $match: qry },
            { $sort: { entrydate: -1 } },
            {
                $lookup: {
                    from: 'taskSchema',
                    localField: 'task_priority',
                    foreignField: '_id',
                    as: 'taskSchema'
                }
            },
            {
                $lookup: {
                    from: 'employeeschemas',
                    localField: 'task_employee',
                    foreignField: '_id',
                    as: 'employeeschemas'
                }
            },
            {
                $group: {
                    _id: {
                        id: "$_id",
                        task_name: "$task_name",
                        task_description: "$task_description",
                        startdate: "$date",
                        duedate: "$duedate",
                        task_priority: "$taskSchema.discription",
                        task_status: "$task_status",
                        entrydate: "$entrydate",
                        end_time: "$end_time",
                        main_bk: "$main_bk",
                        c_j_s_p: "$c_j_s_p",
                        vouc_code: "$vouc_code",
                        usrnm: "$usrnm",
                        filenames: "$filename",
                        empName: "$employeeschemas.full_name"
                    },
                }
            }
        ]);

        res.json({ success: true, summary, });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.TaskStatusUpdateByEmp = async (req, res) => {
    try {
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.format('x');

        if(req.body.TaskStatus === 'Done'){
            let state_mast = {
                task_status: req.body.TaskStatus,
                pending_remark: req.body.TaskRemark,
                end_time: entryDateObject,
                end_time_datemilisecond: entrydatemilisecond,
                update: entryDateObject,
                update_datemilisecond: entrydatemilisecond,
            };
    
            await task_managerSchema.updateOne({ _id: req.body.id }, state_mast);
        }
        else{
            let state_mast = {
                task_status: req.body.TaskStatus,
                pending_remark: req.body.TaskRemark,
                update: entryDateObject,
                update_datemilisecond: entrydatemilisecond,
            };
    
            await task_managerSchema.updateOne({ _id: req.body.id }, state_mast);
        }
        res.json({ status: true, message: 'Task Status Updated Successfully' });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};