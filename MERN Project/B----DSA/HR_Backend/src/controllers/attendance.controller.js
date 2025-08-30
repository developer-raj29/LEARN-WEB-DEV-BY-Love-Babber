const dailyatten_mast = require('../models/attenSchema.js');
const designation_master = require('../models/designationSchema.js');
const department_master = require('../models/department_master_Schema.js');
const employee_master = require('../models/employeeSchema.js');
const ShiftSchema = require('../models/shiftSchema.js');
const salary_schema = require('../models/salarySchema');
const leaveSchema = require('../models/leaveSchema.js');
const employeeschemas = require('../models/employeeSchema.js');

const mongoose = require('mongoose'); // Import mongoose
const excelJS = require('exceljs'); // Import mongoose
const salarystru_master = require('../models/salarystruSchema');
const machineSchema = require('../models/machine_mast.js');
const employeecategorySchema = require('../models/employeecategorySchema.js');
const autho_setup = require('../models/autho_setup.js');
const autho_log = require('../models/autho_log.js');
const DivSchema = require('../models/divSchema.js');
const cron = require('node-cron');
const Company = require('../models/company.model.js');
const shift_master = require('../models/shiftSchema.js');

const XLSX = require('xlsx');

const multer = require("multer")
const upload = multer({ dest: 'uploads/' });

const user_log = require('../models/user_log_Schema.js');
const moment = require('moment-timezone');

function getPresentAndAbsentCount(data) {
    const result = {};

    data.forEach(entry => {
        const date = entry.date;
        const summary = entry.summary;

        let present = 0;
        let absent = 0;

        summary.forEach(item => {
            if (item._id.lvname.includes('Present')) {
                present += item.count;
            } else if (item._id.lvname.includes('Absent')) {
                absent += item.count;
            }
        });

        result[date] = { present, absent };
    });

    return result;
}

exports.GetMonthsDateattendance = async (req, res) => {
    try {
        const month = req.body.month;
        const currentDate = moment().tz("Asia/Kolkata");
        const currentMonth = currentDate.month();
        const currentYear = currentDate.year();

        let year;
        if (moment(`${month} ${currentYear}`, 'MMMM YYYY').month() > currentMonth) {
            year = currentYear - 1;
        } else {
            year = currentYear;
        }

        const startDate = moment(`${month} ${year}`, 'MMMM YYYY').startOf('month').tz("Asia/Kolkata");
        const endDate = moment(`${month} ${year}`, 'MMMM YYYY').endOf('month').tz("Asia/Kolkata");

        const Todaysummary = [];

        for (let date = startDate.clone(); date.isSameOrBefore(endDate); date.add(1, 'day')) {
            const startOfDay = date.startOf('day').valueOf();
            const endOfDay = date.endOf('day').valueOf();

            const Todayqry = {
                masterid: req.body.masterid,
                co_code: req.body.compid,
                div_code: req.body.divid,
                del: "N",
                dalatten_datemilisecond: { $gte: startOfDay, $lte: endOfDay }
            };

            const summary = await dailyatten_mast.aggregate([
                { $match: Todayqry },
                {
                    $lookup: {
                        from: 'leaveSchema',
                        localField: 'dalatten_atdtype',
                        foreignField: '_id',
                        as: 'leaveSchema'
                    }
                },
                {
                    $group: {
                        _id: {
                            lvid: "$leaveSchema._id",
                            lvname: "$leaveSchema.discription",
                        },
                        dalatten_total_hour: { $sum: "$dalatten_total_hour" },
                        count: { $sum: 1 }
                    }
                }
            ]);

            Todaysummary.push({ date: date.format('YYYY-MM-DD'), summary });
        }

        res.json({ success: true, Todaysummary: getPresentAndAbsentCount(Todaysummary) });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.Getattendance = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, co_code: req.body.compid, div_code: req.body.divid, del: "N" };
        const month = req.body.month;
        req.body.month && (qry.month = month);
        req.body.employee && (qry.employee_name = mongoose.Types.ObjectId(employee));
        console.log(qry)

        const summary = await dailyatten_mast.aggregate([
            { $match: qry },
            {
                $lookup: {
                    from: 'leaveSchema',
                    localField: 'dalatten_atdtype',
                    foreignField: '_id',
                    as: 'leaveSchema'
                }
            },
            {
                $group: {
                    _id: {
                        lvid: "$leaveSchema._id",
                        lvname: "$leaveSchema.discription",
                    },
                    dalatten_total_hour: { $sum: "$dalatten_total_hour" },
                    count: { $sum: 1 }
                }
            }
        ]);

        var date = new Date(req.body.date ? req.body.date : null);
        var DateObject = moment(date).tz("Asia/Kolkata");

        var startOfDay = DateObject.clone().startOf('day').valueOf();
        var endOfDay = DateObject.clone().endOf('day').valueOf();
        const Todayqry = {
            co_code: req.body.compid,
            div_code: req.body.divid,
            masterid: req.body.masterid,
            del: "N",
            dalatten_datemilisecond: { $gte: startOfDay, $lte: endOfDay }
        };

        const Todaysummary = await dailyatten_mast.aggregate([
            { $match: Todayqry },
            {
                $lookup: {
                    from: 'leaveSchema',
                    localField: 'dalatten_atdtype',
                    foreignField: '_id',
                    as: 'leaveSchema'
                }
            },
            {
                $group: {
                    _id: {
                        lvid: "$leaveSchema._id",
                        lvname: "$leaveSchema.discription",
                    },
                    dalatten_total_hour: { $sum: "$dalatten_total_hour" },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({ success: true, summary, Todaysummary });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.GetattendanceShift = async (req, res) => {
    try {
        console.log(req.body)
        const qry = { masterid: req.body.masterid, del: "N" };
        var month = req.body.month; // Define month appropriately based on your logic
        if (month == undefined) month = "April"
        req.body.month && (qry.month = month); // Add month condition if present
        req.body.employee && (qry.employee_name = mongoose.Types.ObjectId(employee)); // Add employee condition if present

        const summary = await dailyatten_mast.aggregate([
            { $match: qry },
            {
                $lookup: {
                    from: 'leaveSchema',
                    localField: 'dalatten_atdtype',
                    foreignField: '_id',
                    as: 'leaveSchema'
                }
            },

            {
                $lookup: {
                    from: 'shiftSchema',
                    localField: 'dalatten_shiftnm',
                    foreignField: '_id',
                    as: 'shiftSchema'
                }
            },
            {
                $group: {
                    _id: {
                        lvid: "$leaveSchema._id",
                        lvname: "$leaveSchema.discription",
                        shiftname: "$shiftSchema.shift_name",

                    },
                    dalatten_total_hour: { $sum: "$dalatten_total_hour" },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({ success: true, summary });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.Getattendancedept = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, del: "N" };
        var month = req.body.month; // Define month appropriately based on your logic
        if (month == undefined) month = "April"
        req.body.month && (qry.month = month); // Add month condition if present
        req.body.employee && (qry.employee_name = mongoose.Types.ObjectId(req.body.employee)); // Add employee condition if present

        const summary = await dailyatten_mast.aggregate([
            { $match: qry },
            {
                $lookup: {
                    from: 'leaveSchema',
                    localField: 'dalatten_atdtype',
                    foreignField: '_id',
                    as: 'leaveSchema'
                }
            },
            {
                $lookup: {
                    from: 'employeeschemas',
                    localField: 'employee_name',
                    foreignField: '_id',
                    as: 'employeeschemas'
                }
            },
            {
                $lookup: {
                    from: 'departmentSchema',
                    localField: 'employeeschemas.department',
                    foreignField: '_id',
                    as: 'departmentSchema'
                }
            },
            {
                $lookup: {
                    from: 'shiftSchema',
                    localField: 'dalatten_shiftnm',
                    foreignField: '_id',
                    as: 'shiftSchema'
                }
            },
            {
                $group: {
                    _id: {
                        lvid: "$leaveSchema._id",
                        lvname: "$leaveSchema.discription",
                        lvcode: "$leaveSchema.code",
                        deptname: "$departmentSchema.discription",

                    },
                    dalatten_total_hour: { $sum: "$dalatten_total_hour" },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({ success: true, summary });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

function getDates(startDate, stopDate, empid) {
    var dateArray = []
    var currentDate = startDate
    var stopDate = stopDate

    if (stopDate > moment(Date.now()).format('x')) stopDate = moment(Date.now()).add(-1, 'days').format('x')
    while (currentDate < stopDate) {
        // console.log(moment(currentDate).toISOString(true).replace(/["']/g, ""),moment(currentDate).toISOString(true))
        var arr = { 'date': moment(currentDate).format("DD/MM/YYYY"), 'datems': moment(currentDate).format('x'), 'day': moment(currentDate).day() }
        dateArray.push(arr)
        currentDate = moment(currentDate).add(1, 'days')

    }
    return dateArray
}

function sundabs(req, dateArray, employeeid, defashift, coCode,divCode) {//newjobentobj
    return new Promise(async function (fullfill) {
        console.log('319sundabs',dateArray)
        if (dateArray.length > 0) {
            for (var i = 0; i < dateArray.length; i++) {

                let dailyatten = new dailyatten_mast();
                var dalatten_date = dateArray[i].date;
                let dalattenDateObject = moment(dalatten_date, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                var month = dalattenDateObject.format('M');
                var monthnm = ""
                if (month == 1) monthnm = "January"
                if (month == 2) monthnm = "February"
                if (month == 3) monthnm = "March"
                if (month == 4) monthnm = "April"
                if (month == 5) monthnm = "May"
                if (month == 6) monthnm = "June"
                if (month == 7) monthnm = "July"
                if (month == 8) monthnm = "August"
                if (month == 9) monthnm = "September"
                if (month == 10) monthnm = "October"
                if (month == 11) monthnm = "November"
                if (month == 12) monthnm = "December"

                dailyatten.dalatten_date = dalatten_date
                dailyatten.month = monthnm;
                let dalattendatemilisecond = dalattenDateObject.format('x');
                dailyatten.monthnm = monthnm;
                dailyatten.dalatten_date = dalattenDateObject;
                dailyatten.dalatten_datemilisecond = dalattendatemilisecond;
                dailyatten.employee_name = employeeid;
                dailyatten.dalatten_shiftnm = new mongoose.Types.ObjectId(defashift);
                if (dateArray[i].day == 0) dailyatten.dalatten_atdtype = new mongoose.Types.ObjectId("650809b30b45a44dfce3a3ca")
                else dailyatten.dalatten_atdtype = new mongoose.Types.ObjectId("64ba55757a141c36340cc6c7")

                dailyatten.dalatten_intime = 0;
                dailyatten.dalatten_outtime = 0;
                dailyatten.dalatten_total_hour = 0;
                dailyatten.dalatten_overtime = 0;
                dailyatten.dalatten_remarks = "Auto Entry";
                // dailyatten.dalatten_arry = req.body.dalatten_arry;
                dailyatten.user = "Auto";
                dailyatten.masterid = req.masterid;
                dailyatten.co_code = coCode;
                dailyatten.div_code = divCode;
                var dailyatten_entry = new Date();
                var entryDateObject = moment(dailyatten_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                var entrydatemilisecond = entryDateObject.format('x');
                dailyatten.entry = entryDateObject;
                dailyatten.entry_datemilisecond = entrydatemilisecond;
                dailyatten.del = 'N';

                await dailyatten.save()
                    .then(async function () {
                        var userLog = new user_log();
                        userLog.user_name = "Auto";
                        userLog.module_name = 'Daily Attendance Master';
                        userLog.user_op = 'A';
                        userLog.entry_id = dailyatten._id;

                        var userLog_entry = new Date();
                        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                        var entrydatemilisecond = userDateObject.format('x');

                        userLog.entry_date = userDateObject;
                        userLog.entry_datemilisecond = entrydatemilisecond;

                        try {
                            await userLog.save();
                            // console.log('User log saved successfully');
                        } catch (error) {
                            console.error('Error saving user log:', error);
                        }
                    })
                    .catch(function (err) {
                        console.error('Error saving daily attendance:', err);
                    });
                if (i == dateArray.length - 1) {
                    fullfill();
                }
            }
        }
        else {
            fullfill();
        }
    })
}

function arrayexists(reparray, compr, comppnm, compr1, comppnm1, compr2, comppnm2, compr3, comppnm3) {
    var index = -1
    if (reparray.length > 0) {
        for (var i = 0; i < reparray.length; i++) {
            if (reparray[i] != undefined && reparray[i][compr].toString().trim() == comppnm && reparray[i][compr1].toString().trim() == comppnm1 && reparray[i][compr2].toString().trim() == comppnm2 && reparray[i][compr3].toString().trim() == comppnm3) {
                index = i;
                break;
            }
        }
    }
    return index;
}
function arrayexistssingle(reparray, compr, comppnm) {
    var index = -1
    if (reparray.length > 0) {
        for (var r = 0; r < reparray.length; r++) {
            if (reparray[r] != undefined && reparray[r][compr].toString().trim() == comppnm.toString().trim()) {
                index = r;
                break;
            }
        }
    }
    return index;
}

function diff_hours(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);

    diff = diff * -1
    var hrs = parseInt(diff)
    var mins100 = parseFloat(diff) - parseInt(hrs);
    var mins = parseFloat(parseFloat(parseFloat(mins100 * 60) / 100).toFixed(2));

    var finhrs = parseFloat(hrs) + parseFloat(mins)
    //   console.log(diff,hrs,mins100,mins,finhrs)

    return finhrs;

}

function NightdiffTime(time1, time2) {
    var hour1 = time1.split(':')[0];
    var hour2 = time2.split(':')[0];
    var min1 = time1.split(':')[1];
    var min2 = time2.split(':')[1];

    // hour2 = "06";
    // min2 = "00";
    var diff_hour = hour2 - hour1;
    var diff_min = min2 - min1;
    // console.log('365',hour1,min1,hour2,min2,diff_hour,diff_min)
    if (diff_hour < 0) {
        diff_hour += 24;
    }
    if (diff_min < 0) {
        diff_min += 60;
        diff_hour--;
    } else if (diff_min >= 60) {
        diff_min -= 60;
        diff_hour++;
    }

    diff_min = parseFloat(diff_min).toFixed(0)
    return [diff_hour + ":" + diff_min, parseFloat(diff_hour + "." + diff_min)]

}


function dailyattd(req, qry, Srtdate, Enddate) {//newjobentobj
    return new Promise(async function (fullfill) {
        const dateArray = getDates(Srtdate, Enddate)

        const dailyattenmst = await dailyatten_mast.find(qry).populate('employee_name', 'full_name ol_appl department').populate('dalatten_shiftnm')
            .populate([{ path: 'employee_name', select: 'full_name ol_appl department', populate: { path: 'department', select: 'description' } }])
            .populate('dalatten_atdtype', 'discription').sort({ dalatten_datemilisecond: 1 });
            
            // console.log('480',qry,dailyattenmst.length)

        if (dailyattenmst.length > 0) {

            for (var i = 0; i < dailyattenmst.length; i++) {
                
                // console.log(i,dailyattenmst[i].dalatten_date)
                var arryidx = await arrayexistssingle(dateArray, 'date', moment(dailyattenmst[i].dalatten_date).format("DD/MM/YYYY"));
                if (arryidx >= 0) {
                    dateArray.splice(arryidx, 1)
                    // em = em-1;
                }
                if (dailyattenmst[i]['dalatten_intime'] != "" && dailyattenmst[i]['dalatten_outtime'] != undefined) {
                    var prvdt = moment(dailyattenmst[i].dalatten_date, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var intime = dailyattenmst[i]['dalatten_intime'].split(":");
                    var outtime = "";
                    var intm = new Date();
                    var outtm = new Date();
                    if (dailyattenmst[i]['dalatten_outtime'] != undefined) outtime = dailyattenmst[i]['dalatten_outtime'].split(":");//

                    if (intime[1] != undefined && dailyattenmst[i]['dalatten_intime'] != undefined) {
                        intm = new Date(prvdt.format('YYYY'), Number(prvdt.format('MM') - 1), prvdt.format('DD'), intime[0], intime[1].substr(0, 2), 0, 0);
                    }
                    if (outtime[1] != undefined && dailyattenmst[i]['dalatten_outtime'] != undefined) {
                        outtm = new Date(prvdt.format('YYYY'), Number(prvdt.format('MM') - 1), prvdt.format('DD'), outtime[0], outtime[1].substr(0, 2), 0, 0);
                    }
                    var tothrs = parseFloat(diff_hours(intm, outtm)).toFixed(2);

                    // console.log('503',i, dailyattenmst[i].employee_name._id, intime, outtime, tothrs, dailyattenmst[i].dalatten_shiftnm.total_hour, dailyattenmst[i].dalatten_shiftnm.total_hour - tothrs)

                    let newratejob = {};
                    if (parseFloat(tothrs) < 0)  //night
                    {
                        var nighttothrs = NightdiffTime(dailyattenmst[i]['dalatten_intime'], dailyattenmst[i]['dalatten_outtime']);
                        var atdqry = {  dalatten_date: dailyattenmst[i]['dalatten_date'], employee_name: dailyattenmst[i].employee_name._id, del: "N" } //month: req?.month,
                        var atdcount = await dailyatten_mast.find(atdqry)

                        tothrs = nighttothrs[1]
                        var hrs = nighttothrs[0].toString().split(":");//
                        // console.log('924', nighttothrs, hrs, tothrs,atdqry,atdcount.length)

                        dailyattenmst[i].dalatten_total_hour = dailyattenmst[i]?.dalatten_shiftnm?.total_hour + ".00"
                        newratejob.tot_hrs = tothrs;
                        newratejob.dalatten_total_hour = dailyattenmst[i].dalatten_shiftnm.total_hour
                        if (parseFloat(tothrs) > 0) {
                            newratejob.dalatten_overtime = parseFloat(tothrs)
                            newratejob.dalatten_overtimehrs = parseFloat(hrs[0])
                            newratejob.dalatten_overtimemin = parseFloat(hrs[1])
                        }
                        if (atdcount.length > 1) {
                            newratejob.dalatten_atdtype = new mongoose.Types.ObjectId("656f030c096de77d20abe135")
                            var shifthrhrs = dailyattenmst[i].dalatten_shiftnm.total_hour
                            // if (parseFloat(tothrs) == 8) tothrs = 10;
                            if (parseFloat(shifthrhrs) == 12) {
                                tothrs = 12;
                                hrs[0] = 12
                                hrs[1] = 0
                            }
                            if (parseFloat(shifthrhrs) == 10) {
                                tothrs = 10;
                                hrs[0] = 10
                                hrs[1] = 0
                            }
                            if (parseFloat(shifthrhrs) == 8 && tothrs > 0) {
                                hrs[0] = parseFloat(hrs[0]) + 2
                                tothrs = parseFloat(tothrs) + 2
                            }
                            if (parseFloat(tothrs) > 0) {

                                newratejob.tot_hrs = parseFloat(tothrs).toFixed(2)
                                newratejob.dalatten_overtime = parseFloat(tothrs).toFixed(2)
                                newratejob.dalatten_overtimehrs = parseInt(hrs[0])
                                newratejob.dalatten_overtimemin = parseInt(hrs[1])
                            }
                        }
                        else {
                            newratejob.dalatten_atdtype = new mongoose.Types.ObjectId("646391fad4b7b3d45c9c8a9d")
                            console.log(hrs)
                            // var hrs = tothrs.toString().split(".");//
                            if (isNaN(parseInt(hrs[1]))) hrs[1] = 0;
                            if (isNaN(parseInt(hrs[0]) < 0)) hrs[0] = parseInt(hrs[0]) * -1;

                            tm12am = new Date(prvdt.format('YYYY'), Number(prvdt.format('MM') - 1), prvdt.format('DD'), "00", "00", 0, 0);
                            tm24am = new Date(prvdt.format('YYYY'), Number(prvdt.format('MM') - 1), prvdt.format('DD'), "24", "00", 0, 0);

                            if (intime[1] != undefined && dailyattenmst[i]['dalatten_intime'] != undefined) {
                                intm = new Date(prvdt.format('YYYY'), Number(prvdt.format('MM') - 1), prvdt.format('DD'), intime[0], intime[1].substr(0, 2), 0, 0);
                            }
                            if (outtime[1] != undefined && dailyattenmst[i]['dalatten_outtime'] != undefined) {
                                outtm = new Date(prvdt.format('YYYY'), Number(prvdt.format('MM') - 1), prvdt.format('DD'), outtime[0], outtime[1].substr(0, 2), 0, 0);

                            }
                            var tothrsnight = parseFloat(diff_hours(intm, tm24am)).toFixed(2);
                            var tothrsmorning = parseFloat(diff_hours(tm12am, outtm)).toFixed(2);

                            var hrsnight = tothrsnight.toString().split(".");//
                            var hrsmorning = tothrsmorning.toString().split(".");//
                            var totmins = parseFloat(hrsnight[1]) + parseFloat(hrsmorning[1])
                            var hours = Math.floor(totmins / 60);
                            var minutes = totmins % 60;
                            var tothrs = parseFloat(parseFloat(hrsnight[0]) + parseFloat(hrsmorning[0]) + parseFloat(hours) + parseFloat(parseFloat(minutes) / 100)).toFixed(2); //diff_hours(intm,outtm);

                            var nighttothrs = tothrs.toString().split(".");//
                            dailyattenmst[i].tot_hrs = tothrs //nighttothrs[0] +   "." + nighttothrs[1]
                            // newratejob.dalatten_overtime = parseFloat(tothrs)- parseInt(dailyattenmst[i].dalatten_shiftnm.total_hour) ;
                            var otouttime = tothrs.toString().split(".");
                            otintm = new Date(prvdt.format('YYYY'), Number(prvdt.format('MM') - 1), prvdt.format('DD'), newratejob.dalatten_total_hour, "00", 0, 0);
                            otouttm = new Date(prvdt.format('YYYY'), Number(prvdt.format('MM') - 1), prvdt.format('DD'), otouttime[0], otouttime[1], 0, 0);
                            var diffothrs = parseFloat(diff_hours(otintm, otouttm)).toFixed(2);
                            newratejob.dalatten_overtime = diffothrs

                            if (parseFloat(diffothrs) > 0) {
                                var nighttothrs = diffothrs.toString().split(".");//
                                if (nighttothrs[0] != "") newratejob.dalatten_overtimehrs = parseInt(nighttothrs[0])
                                if (nighttothrs[1] != "") newratejob.dalatten_overtimemin = parseInt(nighttothrs[1])
                            }
                            else {
                                newratejob.dalatten_overtime = 0
                                newratejob.dalatten_overtimehrs = 0
                                newratejob.dalatten_overtimemin = 0
                            }
                            // if ((parseInt(nighttothrs[1]))>0 &&  parseFloat(newratejob.dalatten_overtimehrs)<0  ) newratejob.dalatten_overtimemin = parseInt(nighttothrs[1]) *-1; 
                            // else 
                            // // if (newratejob.dalatten_overtimehrs>0) newratejob.dalatten_overtime = newratejob.dalatten_overtimehrs+   "." + newratejob.dalatten_overtimemin
                            // else newratejob.dalatten_overtime = parseFloat(parseFloat(newratejob.dalatten_overtimehrs) *-1 +   "." + parseFloat(newratejob.dalatten_overtimemin)*-1)*-1
                            // 
                            console.log('1000', tothrsnight, tothrsmorning, tothrs, nighttothrs, '469', dailyattenmst[i].dalatten_shiftnm.total_hour, hrs[0], hrs[1], nighttothrs, tothrs, newratejob.dalatten_overtime, newratejob.dalatten_overtimehrs, newratejob.dalatten_overtimemin)
                        }
                    }
                    else {
                        if (dailyattenmst[i].dalatten_shiftnm != null) dailyattenmst[i].dalatten_total_hour = dailyattenmst[i].dalatten_shiftnm.total_hour + ".00"
                        else dailyattenmst[i].dalatten_total_hour = "0.00"
                        newratejob.tot_hrs = tothrs;
                        newratejob.dalatten_total_hour = dailyattenmst[i].dalatten_total_hour
                        //newratejob.dalatten_overtime = parseFloat(parseFloat(tothrs)-parseFloat(dailyattenmst[i].dalatten_total_hour)).toFixed(2) ;
                        if (dailyattenmst[i]['dalatten_intime'] != undefined && dailyattenmst[i]['dalatten_intime'] != "00:00" && parseFloat(newratejob.dalatten_total_hour) > parseFloat(tothrs)) {
                            var hrs = tothrs.toString().split(".");//
                            if (isNaN(parseInt(hrs[1]))) hrs[1] = 0;
                            newratejob.dalatten_overtimehrs = parseInt(dailyattenmst[i].dalatten_total_hour) - 1 - parseInt(hrs[0]);
                            newratejob.dalatten_overtimemin = 60 - parseInt(hrs[1]);

                            var otouttime = tothrs.toString().split(".");
                            otintm = new Date(prvdt.format('YYYY'), Number(prvdt.format('MM') - 1), prvdt.format('DD'), newratejob.dalatten_total_hour, "00", 0, 0);
                            otouttm = new Date(prvdt.format('YYYY'), Number(prvdt.format('MM') - 1), prvdt.format('DD'), otouttime[0], otouttime[1], 0, 0);

                            var diffothrs = diff_hours(otouttm, otintm);
                            newratejob.dalatten_overtime = 0
                            newratejob.dalatten_overtimehrs = 0
                            newratejob.dalatten_overtimemin = 0

                            var hrs = tothrs.toString().split(".");//
                            newratejob.dalatten_overtime = tothrs
                            if (isNaN(parseInt(hrs[1]))) hrs[1] = 0;
                            newratejob.dalatten_overtimehrs = parseInt(hrs[0])
                            newratejob.dalatten_overtimemin = parseInt(hrs[1])

                            if (parseInt(dailyattenmst[i].dalatten_shiftnm.total_hour) == 12) {
                                if (parseFloat(diffothrs) <= 1) {
                                    diffothrs = 0;
                                }
                                else {
                                    diffothrs = parseFloat(diffothrs) - 1
                                    console.log('451', parseFloat(diffothrs))
                                    // newratejob.dalatten_overtime =0
                                    // //var hrs = newratejob.dalatten_overtime.toString().split(".");//
                                    // newratejob.dalatten_overtimehrs = 0
                                    // newratejob.dalatten_overtimemin = 0//parseFloat(parseFloat(newratejob.dalatten_overtime) -  parseInt(newratejob.dalatten_overtime)).toFixed(2)

                                }
                            }
                            //if ((parseInt(dailyattenmst[i].dalatten_shiftnm.total_hour)==12) && parseInt(newratejob.dalatten_overtimehrs)>=1)  newratejob.dalatten_overtimehrs = parseInt(newratejob.dalatten_overtimehrs)-1
                            //newratejob.dalatten_overtime = parseInt(newratejob.dalatten_overtimehrs) + (parseInt(newratejob.dalatten_overtimemin)/100)
                            console.log('654',prvdt, (parseFloat(tothrs) - parseFloat(newratejob.dalatten_total_hour)), (parseFloat(tothrs) - parseFloat(newratejob.dalatten_total_hour)) <= 1, '438', dailyattenmst[i].dalatten_shiftnm.total_hour, newratejob.dalatten_overtimemin, parseInt(hrs[0]), parseInt(hrs[1]), newratejob.dalatten_overtimehrs, newratejob.dalatten_overtime)

                            if ((parseInt(hrs[0])==0) && (parseInt(hrs[1])==0)) 
                            {
                                diffothrs=0
                                newratejob.dalatten_overtime=0;
                                newratejob.dalatten_overtimemin=0;
                            }

                            newratejob.dalatten_overtime = diffothrs * -1
                            newratejob.dalatten_overtimehrs = parseInt(newratejob.dalatten_overtime)
                            newratejob.dalatten_overtimemin = parseFloat(parseFloat(newratejob.dalatten_overtime) - parseInt(newratejob.dalatten_overtime)).toFixed(2)
                            newratejob.dalatten_overtimemin = parseFloat(parseFloat(newratejob.dalatten_overtimemin) * 100).toFixed(0)
                            console.log('660', newratejob.dalatten_overtime, diffothrs)
                        }
                        else {
                            if (dailyattenmst[i]['dalatten_intime'] != undefined && dailyattenmst[i]['dalatten_intime'] != "00:00" && parseFloat(newratejob.dalatten_total_hour) <= parseFloat(tothrs)) {
                                var hrs = tothrs.toString().split(".");//
                                if (isNaN(parseInt(hrs[1]))) hrs[1] = 0;
                                if (dailyattenmst[i].dalatten_shiftnm != null) newratejob.dalatten_overtimehrs = parseInt(hrs[0]) - parseInt(dailyattenmst[i].dalatten_shiftnm.total_hour);
                                else newratejob.dalatten_overtimehrs = 0;
                                newratejob.dalatten_overtimemin = parseInt(hrs[1]);
                                if (hrs[1].startsWith("0")) newratejob.dalatten_overtimemin = "0" + newratejob.dalatten_overtimemin

                                if (dailyattenmst[i].dalatten_shiftnm != null && parseFloat(dailyattenmst[i].dalatten_shiftnm.total_hour) == 12) {
                                    if (((parseInt(newratejob.dalatten_total_hour) - parseInt(newratejob.tot_hrs))) > 1) newratejob.dalatten_overtimehrs = parseInt(newratejob.dalatten_overtimehrs)
                                    else newratejob.dalatten_overtimehrs = 0;
                                    console.log('456', newratejob.dalatten_total_hour, dailyattenmst[i].dalatten_shiftnm.total_hour, newratejob.tot_hrs)
                                }
                                //newratejob.dalatten_overtime = parseInt(newratejob.dalatten_overtimehrs) + (parseInt(newratejob.dalatten_overtimemin)/100)
                                if (dailyattenmst[i].dalatten_shiftnm != null) newratejob.dalatten_overtime = (parseInt(hrs[0]) - parseInt(dailyattenmst[i].dalatten_shiftnm.total_hour)) + (parseInt(hrs[1]) / 100)
                                else newratejob.dalatten_overtime = 0
                                // console.log('559', dailyattenmst[i].dalatten_shiftnm.total_hour, newratejob.dalatten_overtimemin, parseInt(hrs[0]), parseInt(hrs[1]), newratejob.dalatten_overtimehrs, newratejob.dalatten_overtime)
                                newratejob.dalatten_overtime = parseFloat(newratejob.dalatten_overtime)
                            }
                            else {
                                newratejob.dalatten_overtimehrs = 0;
                                newratejob.dalatten_overtimemin = 0;
                                newratejob.dalatten_overtime = 0
                            }
                        }
                    }

                    if (dailyattenmst[i] != null && dailyattenmst[i].dalatten_atdtype != null) {
                        if (dailyattenmst[i].dalatten_atdtype.discription == "Weekly Off" || dailyattenmst[i].dalatten_atdtype.discription == "Absent") newratejob.dalatten_overtimehrs = 0
                        if (dailyattenmst[i].dalatten_atdtype.discription == "Weekly Off" || dailyattenmst[i].dalatten_atdtype.discription == "Paid Holiday") {
                            var Srtweek = moment(dailyattenmst[i].dalatten_date).add('days', -7).format('x');
                            var Endweek = dailyattenmst[i].dalatten_datemilisecond;
                            var wkqry = { employee_name: dailyattenmst[i].employee_name._id, dalatten_atdtype: new mongoose.Types.ObjectId("64ba55757a141c36340cc6c7"), $and: [{ dalatten_datemilisecond: { $gte: Srtweek } }, { dalatten_datemilisecond: { $lte: Endweek } }], masterid: req?.masterid, div_code: req?.div_code, del: "N" } //, month: req?.month

                            var weekabs = await dailyatten_mast.find(wkqry)
                            console.log('697',wkqry,weekabs.length)
                            if (weekabs.length >= 4) {

                                dailyattenmst[i].dalatten_atdtype.discription = "Absent"
                                newratejob.dalatten_atdtype = new mongoose.Types.ObjectId("64ba55757a141c36340cc6c7")
                                newratejob.dalatten_overtime = 0
                                newratejob.dalatten_overtimehrs = 0
                                newratejob.dalatten_overtimemin = 0
                            }
                            else {
                                Srtweek = moment(dailyattenmst[i].dalatten_date).add('days', -1).format('x');
                                Endweek = moment(dailyattenmst[i].dalatten_date).add('days', 1).format('x');
                                var wkqry = { employee_name: dailyattenmst[i].employee_name._id, dalatten_atdtype: new mongoose.Types.ObjectId("64ba55757a141c36340cc6c7"), $and: [{ dalatten_datemilisecond: { $gte: Srtweek } }, { dalatten_datemilisecond: { $lte: Endweek } }], masterid: req?.masterid, div_code: req?.div_code, del: "N" } //, month: req?.month
                                var weekabs = await dailyatten_mast.find(wkqry)
                                if (weekabs.length == 2) {

                                    dailyattenmst[i].dalatten_atdtype.discription = "Absent"
                                    newratejob.dalatten_atdtype = new mongoose.Types.ObjectId("64ba55757a141c36340cc6c7")
                                    newratejob.dalatten_overtime = 0
                                    newratejob.dalatten_overtimehrs = 0
                                    newratejob.dalatten_overtimemin = 0
                                }
                                else {
                                    // if (dailyattenmst[i] == null || dailyattenmst[i].dalatten_shiftnm == null) dailyattenmst[i].dalatten_shiftnm.total_hour = "0"
                                    if (dailyattenmst[i] == null || dailyattenmst[i].dalatten_shiftnm == null) {
                                        if (dailyattenmst[i] == null) {
                                            dailyattenmst[i] = {}; // Initialize if null
                                        }
                                        if (dailyattenmst[i].dalatten_shiftnm == null) {
                                            dailyattenmst[i].dalatten_shiftnm = {}; // Initialize if null
                                        }
                                        dailyattenmst[i].dalatten_shiftnm.total_hour = "0";
                                    }
                                    dailyattenmst[i].dalatten_total_hour = dailyattenmst[i].dalatten_shiftnm.total_hour + ".00"
                                    newratejob.tot_hrs = tothrs;
                                    newratejob.dalatten_total_hour = dailyattenmst[i].dalatten_shiftnm.total_hour + ".00"
                                    var hrs = tothrs.toString().split(".");//
                                    if (isNaN(parseInt(hrs[1]))) hrs[1] = 0;

                                    // if (parseFloat(newratejob.dalatten_total_hour) ==12 && parseFloat(tothrs)>=10) tothrs = "12.00" // changed on 05032024 as per tanu
                                    if (parseFloat(newratejob.dalatten_total_hour) == 12) tothrs = "12.00"
                                    if (parseFloat(newratejob.dalatten_total_hour) == 10) tothrs = "10.00"
                                    // if (parseFloat(newratejob.dalatten_total_hour) ==8 && parseFloat(tothrs)>=7) tothrs = "10.00" // changed on 05032024 as per tanu
                                    if (parseFloat(newratejob.dalatten_total_hour) == 8 && parseFloat(tothrs) > 0) tothrs = parseFloat(tothrs) + 2
                                    newratejob.dalatten_overtime = tothrs
                                    newratejob.dalatten_overtimehrs = parseInt(newratejob.dalatten_overtime)
                                    newratejob.dalatten_overtimemin = parseFloat(parseFloat(newratejob.dalatten_overtime) - parseInt(newratejob.dalatten_overtime)).toFixed(2)

                                    if (dailyattenmst[i]['dalatten_intime'] != undefined && dailyattenmst[i]['dalatten_intime'] == "0" && dailyattenmst[i]['dalatten_outtime'] == "0") 
                                    {
                                        newratejob.dalatten_overtime = 0
                                        newratejob.dalatten_overtimehrs = 0
                                        newratejob.dalatten_overtimemin = 0
                                    }
                                    // console.log('newratejob',newratejob)
                                }
                            }
                        }
                        if (dailyattenmst[i].dalatten_atdtype.discription == "Half Day" && parseFloat(tothrs) > 0) {
                            var hrs = tothrs.toString().split(".");//
                            newratejob.dalatten_overtime = tothrs
                            if (isNaN(parseInt(hrs[1]))) hrs[1] = 0;
                            newratejob.dalatten_overtimehrs = parseInt(hrs[0])
                            newratejob.dalatten_overtimemin = parseInt(hrs[1])
                        }
                        else {
                            if (dailyattenmst[i].employee_name.ol_appl == "N" && dailyattenmst[i].dalatten_atdtype.discription != "Night" && dailyattenmst[i].dalatten_atdtype.discription != "Weekly Off") {
                                newratejob.dalatten_overtime = 0
                                newratejob.dalatten_overtimehrs = 0
                                newratejob.dalatten_overtimemin = 0
                            }
                        }
                    }

                    let query = { _id: dailyattenmst[i]._id }
                    if (isNaN(newratejob.dalatten_overtimemin)) newratejob.dalatten_overtimemin = 0;
                    if (dailyattenmst[i].dalatten_atdtype.discription == "Absent")  //dailyattenmst[i].dalatten_atdtype.discription == "Weekly Off" ||
                    {
                        newratejob.dalatten_overtime = 0
                        newratejob.dalatten_overtimehrs = 0
                        newratejob.dalatten_overtimemin = 0
                    }

                    if (isNaN(newratejob.tot_hrs) || dailyattenmst[i]['dalatten_outtime'] == undefined || dailyattenmst[i]['dalatten_outtime'] == "") newratejob.tot_hrs = 0;
                    if (isNaN(newratejob.dalatten_overtime) || dailyattenmst[i]['dalatten_outtime'] == undefined || dailyattenmst[i]['dalatten_outtime'] == "") newratejob.dalatten_overtime = 0;
                    if (isNaN(newratejob.dalatten_overtimehrs) || dailyattenmst[i]['dalatten_outtime'] == undefined || dailyattenmst[i]['dalatten_outtime'] == "") newratejob.dalatten_overtimehrs = 0;
                    if (isNaN(newratejob.dalatten_overtimemin) || dailyattenmst[i]['dalatten_outtime'] == undefined || dailyattenmst[i]['dalatten_outtime'] == "") newratejob.dalatten_overtimemin = 0;

                    if (dailyattenmst[i]['dalatten_outtime'] == undefined || dailyattenmst[i]['dalatten_outtime'] == "") {
                        if (dailyattenmst[i].dalatten_shiftnm != null) {
                            newratejob.dalatten_total_hour = dailyattenmst[i].dalatten_shiftnm.total_hour + ".00"
                            newratejob.tot_hrs = dailyattenmst[i].dalatten_shiftnm.total_hour + ".00"

                        }
                        else newratejob.dalatten_total_hour = "0.00"

                    }
                    await dailyatten_mast.updateOne(query, newratejob)
                }
                else {
                    let newratejob = {};
                    if (dailyattenmst[i].dalatten_shiftnm != null) newratejob.dalatten_total_hour = dailyattenmst[i].dalatten_shiftnm.total_hour + ".00"
                    else newratejob.dalatten_total_hour = "0.00"
                    if (isNaN(newratejob.tot_hrs) || dailyattenmst[i]['dalatten_outtime'] == undefined || dailyattenmst[i]['dalatten_outtime'] == "") newratejob.tot_hrs = 0;
                    if (isNaN(newratejob.dalatten_overtime) || dailyattenmst[i]['dalatten_outtime'] == undefined || dailyattenmst[i]['dalatten_outtime'] == "") newratejob.dalatten_overtime = 0;
                    if (isNaN(newratejob.dalatten_overtimehrs) || dailyattenmst[i]['dalatten_outtime'] == undefined || dailyattenmst[i]['dalatten_outtime'] == "") newratejob.dalatten_overtimehrs = 0;
                    if (isNaN(newratejob.dalatten_overtimemin) || dailyattenmst[i]['dalatten_outtime'] == undefined || dailyattenmst[i]['dalatten_outtime'] == "") newratejob.dalatten_overtimemin = 0;

                    let query = { _id: dailyattenmst[i]._id }
                    await dailyatten_mast.updateOne(query, newratejob)
                }
                if (i == dailyattenmst.length - 1) {
                    // console.log('dateArray794',dateArray)
                    fullfill(dateArray);
                }
            }
        }
        else {
            console.log('dateArray800',dateArray)
            
            fullfill(dateArray);

        }

    })
}

exports.GetattendanceDetails = async (req, res) => {
    try {
        let today = new Date();
        const gap = getDateDifference(req.body.startDate || new Date(), req.body.endDate || new Date())
        let startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
        let endDate = req.body.endDate ? new Date(req.body.endDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        const qry = { div_code: req.body.divid, co_code: req.body.compid, masterid: req.body.masterid, del: "N", dalatten_date: { $gte: startDate, $lt: endDate } };
        console.log("322", qry)
        var month = req.body.month; // Define month appropriately based on your logic
        // req.body.month && (qry.month = month); // Add month condition if present
        req.body.employee && (qry.employee_name = new mongoose.Types.ObjectId(req.body.employee));
        req.body.leaveType && (qry.dalatten_atdtype = new mongoose.Types.ObjectId(req.body.leaveType));
        // req.body.DepartType && (qry.dalatten_atdtype = new mongoose.Types.ObjectId(req.body.DepartType));

        const currentPage = req.body.currentPage || 1; // Extract current page from the request body
        const rowsPerPage = 1000;// req.body.rowsPerPage || 10; // Extract rows per page from the request body        
        const skip = 0; // (currentPage - 1) * rowsPerPage; // Calculate skip value for pagination


        if (req.body.ot) {
            qry.dalatten_overtime = { $gt: 0 };
        }
        const summarycount = await dailyatten_mast.find(qry, { _id: 1 });

        const summary = await dailyatten_mast.aggregate([
            { $match: qry },
            { $sort: { dalatten_date: -1 } },
            {
                $lookup: {
                    from: 'leaveSchema',
                    localField: 'dalatten_atdtype',
                    foreignField: '_id',
                    as: 'leaveSchema'
                }
            },
            {
                $lookup: {
                    from: 'employeeschemas',
                    localField: 'employee_name',
                    foreignField: '_id',
                    as: 'employeeschemas'
                }
            },
            {
                $lookup: {
                    from: 'departmentSchema',
                    localField: 'employeeschemas.department',
                    foreignField: '_id',
                    as: 'departmentSchema'
                }
            },
            {
                $lookup: {
                    from: 'machineschemas',
                    localField: 'employeeschemas.machine',
                    foreignField: '_id',
                    as: 'machineschemas'
                }
            },
            {
                $lookup: {
                    from: 'shiftSchema',
                    localField: 'dalatten_shiftnm',
                    foreignField: '_id',
                    as: 'shiftSchema'
                }
            },
            {
                $lookup: {
                    from: 'designationSchema',
                    localField: 'employeeschemas.designation',
                    foreignField: '_id',
                    as: 'designationSchema'
                }
            },

            { $skip: skip }, // Skip documents based on current page
            { $limit: rowsPerPage }, // Limit documents based on rows per page
            {
                $group: {
                    _id: {
                        atdid: "$_id",
                        lvid: "$leaveSchema._id",
                        lvname: "$leaveSchema.discription",
                        empname: "$employeeschemas.full_name",
                        gross_sal: "$employeeschemas.gross_sal",
                        machine_code: "$employeeschemas.machine_code",
                        designation: "$designationSchema.discription",
                        machine: "$machineSchema.machine_name",
                        shiftname: "$shiftSchema.shift_name",
                        deptname: "$departmentSchema.discription",
                        dalatten_intime: "$dalatten_intime",
                        dalatten_outtime: "$dalatten_outtime",
                        dalatten_overtime: "$dalatten_overtime",
                        dalatten_total_hour: "$dalatten_total_hour",
                        dalatten_date: "$dalatten_date",
                        dalatten_overtimehrs: "$dalatten_overtimehrs",
                        dalatten_overtimemin: "$dalatten_overtimemin",
                        tot_hrs: "$tot_hrs",
                        edit_by: "$edit_by",
                        machineschemas: "$machineschemas.machine_name"
                    },
                    dalatten_total_hour: { $sum: "$dalatten_total_hour" },

                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({ success: true, summary, summarycount: summarycount.length });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

function removeObjectId(data) {
    return data.map(item => {
        if (item._id && typeof item._id === 'object') {
            return { ...item, _id: item._id.toString() };
        } else {
            return item;
        }
    });
}

const DivisionsGET = async () => {
    try {
        const lastEntryNo = await DivSchema.aggregate([
            { $project: { div_code: "$div_code", div_mast: "$div_mast", ac_email: "$ac_email", ac_pho: "$ac_pho", masterid: "$masterid" } }
        ]);

        const divisionsWithoutObjectId = removeObjectId(lastEntryNo);

        return divisionsWithoutObjectId;
    } catch (err) {
        console.error(err);
        return []
    }
};

const attendCron = async () => {
    try {
        const data = await DivisionsGET();
        let endDate = new Date();
        let startDate = new Date(endDate.getFullYear(), endDate.getMonth()-1, 1);
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);
        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        console.log('969',startDate,endDate)
        let options = { month: 'long' };
        let month = new Intl.DateTimeFormat('en-US', options).format(startDate);

        for (const item of data) {
            // const company = await Company.find({ masterid: item?.masterid},{projection: { _id: 1}});
            const req = {
                // month: month,
                masterid: item?.masterid,
                div_code: item?._id
            }
            console.log("Working on", " ", item?.div_mast)
            var empqry = { div_code: item?._id, masterid: item?.masterid, del: "N" }
            console.log(empqry, startDate, endDate);
            // if (req.body.employee != '') {
                //  empqry = Object.assign(empqry, { _id: new mongoose.Types.ObjectId("66489f679151e1d8e74b372c") })
            // }
            var employee_name = await employee_master.find(empqry).populate('default_shift');
            for (var em = 0; em < employee_name.length; em++) {
                var empqry = { $and: [{ dalatten_datemilisecond: { $gte: startDate } }, { dalatten_datemilisecond: { $lte: endDate } }], masterid: item?.masterid, div_code: item?._id,  del: "N" } //month: month

                absqry = { employee_name: new mongoose.Types.ObjectId(employee_name[em]._id) };

                var employeenameq = { employee_name: new mongoose.Types.ObjectId(employee_name[em]._id) };
                empqry = Object.assign(empqry, employeenameq)

                console.log('endDate',startDate,endDate)

                var dateArray = await dailyattd(req, empqry, startDate, endDate,);

                console.log('dateArray',dateArray)

                var sundabsres = await sundabs(
                    req,
                    dateArray,
                    employee_name[em]._id,
                    employee_name[em].default_shift?._id,
                    employee_name[em].co_code,
                    employee_name[em].div_code
                );
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
};

cron.schedule('47 14 * * *', async () => {
    try {
        console.log("Running Attendance's cron job");

        await attendCron();
        console.log("Done Attendance's cron job");
    } catch (error) {
        console.log(error)
    }
});

exports.AttendCronManual = async (req, res) => {
    try {
        await attendCron()
        res.json({ status: true});
    } catch (err) {
        console.error(err);
        res.status(500).json({status:false, error: 'Internal server error' });
    }
};

exports.shiftTypeGET = async (req, res) => {
    try {
        const lastEntryNo = await ShiftSchema.aggregate([
            { $match: { masterid: req.body.masterid, del: "N" } },
            { $project: { shift_name: "$shift_name", in_time: "$in_time", out_time: "$out_time" } }
        ]);

        res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.LeaveTypeGET = async (req, res) => {
    try {
        const lastEntryNo = await leaveSchema.aggregate([
            { $match: { masterid: req.body.masterid, del: "N" } },
            { $project: { discription: "$discription" } }
        ]);

        res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.DepartmentTypeGET = async (req, res) => {
    try {
        const lastEntryNo = await department_master.aggregate([
            { $match: { masterid: req.body.masterid, del: "N" } },
            { $project: { discription: "$description" } }
        ]);

        res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.salaryStrucGET = async (req, res) => {
    try {
        const lastEntryNo = await salarystru_master.aggregate([
            {
                $match: {
                    masterid: req.body.masterid,
                    del: "N",
                }
            },
            { $project: { salarystru_name: "$salarystru_name" } }
        ]);

        res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.UpdateAttandance = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ status: false, error: 'Missing parameter: id', message: 'Oops Caught an error.' });
        }

        const state_mast = {
            "edit_by": req.body.usrnm,
            "dalatten_shiftnm": req.body.dalatten_shiftnm,
            "dalatten_intime": req.body.dalatten_intime,
            "dalatten_outtime": req.body.dalatten_outtime,
            "dalatten_atdtype": req.body.dalatten_atdtype,
            "tot_hrs": req.body.dalatten_total_hour
        };

        console.log("784", state_mast);
        const query = { _id: req.params.id };
        await dailyatten_mast.updateOne(query, state_mast);

        const userLog = new user_log();
        userLog.user_name = req.body.usrnm;
        userLog.module_name = 'Daily Attendance';
        userLog.user_op = 'U';
        userLog.entry_id = req.params.id;
        const userLog_entry = new Date();
        const userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
        const entrydatemilisecond = userDateObject.valueOf(); // Using valueOf to get milliseconds
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();
        res.json({ status: true, message: 'Update Successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, error: 'Internal server error', message: 'Oops Caught an error.' });
    }
};

exports.AttandanceDELETE = async (req, res) => {
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
        await dailyatten_mast.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'dailyatten_mast',
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

exports.EmployeeNamesGET = async (req, res) => {
    try {
        const lastEntryNo = await employeeschemas.aggregate([
            { $match: { masterid: req.body.masterid, co_code: req.body.compid, div_code: req.body.divid, del: "N" } },
            { $project: { full_name: "$full_name" } }
        ]);

        res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.AddAttendance = async (req, res) => {
    try {
        const shift_hoursssss = await shift_master.findOne({ _id: req.body.dalatten_shiftnm, masterid: req.body.masterid, del: "N" });
        let state_mast = new dailyatten_mast();
        state_mast.employee_name = req.body.employee_name;
        state_mast.dalatten_shiftnm = req.body.dalatten_shiftnm;
        state_mast.dalatten_intime = req.body.dalatten_intime;
        state_mast.dalatten_outtime = req.body.dalatten_outtime;
        state_mast.dalatten_atdtype = req.body.dalatten_atdtype;
        state_mast.dalatten_date = req.body.dalatten_date;
        state_mast.dalatten_total_hour = shift_hoursssss?.total_hour;
        state_mast.tot_hrs = req.body.dalatten_total_hour;
        state_mast.month = req.body.month;
        state_mast.status = "Approve";

        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.format('x');
        state_mast.entry = entryDateObject;
        state_mast.dalatten_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';
        await state_mast.save();

        const userLog = new user_log();
        userLog.user_name = req.body.user;
        userLog.module_name = 'Daily Attendance';
        userLog.user_op = 'A'; // Assuming 'A' stands for 'Add'
        userLog.entry_id = state_mast._id; // Use the newly created attendance ID
        const userLog_entry = new Date();
        const userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
        const entrydatemiliseconds = userDateObject.valueOf();
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemiliseconds;
        await userLog.save();

        res.json({ status: true, message: 'Attendance added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, error: 'Internal server error', message: 'Oops, something went wrong.' });
    }
};

exports.GetEmployeesList = async (req, res) => {
    try {
        console.log("Request Query:", req.query);
        console.log("Request Body:", req.body);

        let searchStr = {};
        const active = req.query.active;
        if (req.query.search) {
            const regex = new RegExp(req.query.search, "i");
            if (!isNaN(Number(req.query.search))) {
                searchStr = {
                    $or: [
                        { 'machine_code': req.query.search },
                        { 'gross_sal': req.query.search },
                        { 'salary': req.query.search },
                        { 'mobile_no': req.query.search },
                    ]
                };
            } else {
                const designationStr = {
                    'discription': regex
                };
                const departmentStr = {
                    'description': regex
                };
                const designation = await designation_master.find(designationStr, { discription: 1 });
                const designationarr = designation.map(d => d._id);
                const department = await department_master.find(departmentStr, { description: 1 });
                const departmentarr = department.map(d => d._id);
                searchStr = {
                    $or: [
                        { 'full_name': regex },
                        { 'machine_code': regex },
                        { 'gross_sal': regex },
                        { 'salary': regex },

                        { designation: { $in: designationarr } },
                        { department: { $in: departmentarr } }
                    ]
                };
            }
        }

        // Filter by company code, division code, and resignation status
        const qry = { co_code: req.body.compid, div_code: req.body.divid, del: "N" };
        req.body.employeeIDD && (qry._id = new mongoose.Types.ObjectId(req.body.employeeIDD));
        searchStr = Object.assign(searchStr, qry);

        if (active === "Active") searchStr = Object.assign(searchStr, { resign: null });
        if (active === "InActive") searchStr = Object.assign(searchStr, { resign: { $ne: null } });


        // Count total number of documents and filtered documents
        const recordsTotal = await employee_master.countDocuments({});
        const recordsFiltered = await employee_master.countDocuments(searchStr);

        var results = await employee_master.find(searchStr, 'full_name machine_code filepath filename loangroup designation department gross_sal salary mobile_no')
            .populate("designation", "discription")
            .populate("department", "discription");

        // if (req.body.id) {
            // searchStr._id = req.body.id;
            results = await employee_master.find(searchStr, {})
                .populate("designation", "discription").populate("department", "discription")
                .populate("grade", "discription").populate("category", "discription")
                .populate("salary_stru", "salarystru_name")
                .populate("salryhd_or_group.salaryhead_name", "salaryhead_name").populate("default_shift", "shift_name")
                .populate("department", "discription").populate("bank", "discription").populate("designation", "discription")
                .populate("machine", "machine_name")
            // .populate("state", "StateName").populate("dispensory", "discription").populate("bank", "discription").populate("work_place", "CityName").populate("city", "CityName").populate("resign_reason", "discription").populate("branch", "discription")

            // .populate("state", "StateName").populate("dispensory", "discription").populate("bank", "discription").populate("work_place", "CityName").populate("city", "CityName").populate("resign_reason", "discription").populate("branch", "discription")

        // }

        // Fetch paginated results


        // Prepare response data
        const responseData = {
            "draw": req.query.draw,
            "recordsFiltered": recordsFiltered,
            "recordsTotal": recordsTotal,
            "data": results
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.GetattendanceDetailsold = async (req, res) => {
    try {
        console.log("Request Query:", req.query);
        console.log("Request Body:", req.body);

        let searchStr = {};
        const active = req.query.active;
        if (req.query.search) {
            const regex = new RegExp(req.query.search, "i");
            if (!isNaN(Number(req.query.search))) {
                searchStr = {
                    $or: [
                        { 'machine_code': req.query.search },
                        { 'gross_sal': req.query.search },
                        { 'salary': req.query.search },
                        { 'mobile_no': req.query.search },
                    ]
                };
            } else {
                const designationStr = {
                    'discription': regex
                };
                const departmentStr = {
                    'description': regex
                };
                const designation = await designation_master.find(designationStr, { discription: 1 });
                const designationarr = designation.map(d => d._id);
                const department = await department_master.find(departmentStr, { description: 1 });
                const departmentarr = department.map(d => d._id);
                searchStr = {
                    $or: [
                        { 'full_name': regex },
                        { 'machine_code': regex },
                        { 'gross_sal': regex },
                        { 'salary': regex },

                        { designation: { $in: designationarr } },
                        { department: { $in: departmentarr } }
                    ]
                };
            }
        }

        // Filter by company code, division code, and resignation status
        const qry = { co_code: req.body.compid, div_code: req.body.divid, del: "N" };
        req.body.employeeIDD && (qry._id = new mongoose.Types.ObjectId(req.body.employeeIDD));
        searchStr = Object.assign(searchStr, qry);

        if (active === "Active") searchStr = Object.assign(searchStr, { resign: null });
        if (active === "InActive") searchStr = Object.assign(searchStr, { resign: { $ne: null } });


        // Count total number of documents and filtered documents
        const recordsTotal = await employee_master.countDocuments({});
        const recordsFiltered = await employee_master.countDocuments(searchStr);

        var results = await employee_master.find(searchStr, 'full_name machine_code filepath filename loangroup designation department gross_sal salary mobile_no')
            .populate("designation", "discription")
            .populate("department", "discription");


        if (req.body.id) {
            searchStr._id = req.body.id;
            results = await employee_master.find(searchStr, {})
                .populate("designation", "discription").populate("department", "discription")
                .populate("grade", "discription").populate("category", "discription")
                .populate("salary_stru", "salarystru_name")
                .populate("salryhd_or_group.salaryhead_name", "salaryhead_name").populate("default_shift", "shift_name")
                .populate("department", "discription").populate("bank", "discription").populate("designation", "discription")
                .populate("machine", "machine_name")
            // .populate("state", "StateName").populate("dispensory", "discription").populate("bank", "discription").populate("work_place", "CityName").populate("city", "CityName").populate("resign_reason", "discription").populate("branch", "discription")

            // .populate("state", "StateName").populate("dispensory", "discription").populate("bank", "discription").populate("work_place", "CityName").populate("city", "CityName").populate("resign_reason", "discription").populate("branch", "discription")

        }

        // Fetch paginated results


        // Prepare response data
        const responseData = {
            "draw": req.query.draw,
            "recordsFiltered": recordsFiltered,
            "recordsTotal": recordsTotal,
            "data": results
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.GetEmpAttendanceDetail = async (req, res) => {
    try {
        console.log(req.body)
        const qry = { masterid: req.body.masterid, del: "N" };
        var month = req.body.month; // Define month appropriately based on your logic
        if (month == undefined) month = "January"
        req.body.month && (qry.month = month); // Add month condition if present
        req.body.employee && (qry.employee_name = new mongoose.Types.ObjectId(req.body.employee));

        const summary = await dailyatten_mast.aggregate([
            { $match: qry },
            {
                $lookup: {
                    from: 'leaveSchema',
                    localField: 'dalatten_atdtype',
                    foreignField: '_id',
                    as: 'leaveSchema'
                }
            },
            {
                $lookup: {
                    from: 'employeeschemas',
                    localField: 'employee_name',
                    foreignField: '_id',
                    as: 'employeeschemas'
                }
            },
            {
                $lookup: {
                    from: 'departmentSchema',
                    localField: 'employeeschemas.department',
                    foreignField: '_id',
                    as: 'departmentSchema'
                }
            },
            {
                $lookup: {
                    from: 'shiftSchema',
                    localField: 'dalatten_shiftnm',
                    foreignField: '_id',
                    as: 'shiftSchema'
                }
            },
            {
                $group: {
                    _id: {
                        atdid: "$_id",
                        lvid: "$leaveSchema._id",
                        lvname: "$leaveSchema.code",
                        empname: "$employeeschemas.full_name",
                        shiftname: "$shiftSchema.shift_name",
                        deptname: "$departmentSchema.discription",
                        dalatten_intime: "$dalatten_intime",
                        dalatten_outtime: "$dalatten_outtime",
                        dalatten_overtime: "$dalatten_overtime",
                        dalatten_total_hour: "$dalatten_total_hour",
                        dalatten_date: "$dalatten_date",
                        dalatten_datemilisecond: "$dalatten_datemilisecond",
                        dalatten_overtimehrs: "$dalatten_overtimehrs",
                        dalatten_overtimemin: "$dalatten_overtimemin",
                        tot_hrs: "$tot_hrs"

                    },
                    dalatten_total_hour: { $sum: "$dalatten_total_hour" },

                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({ success: true, summary });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.GetSalary = async (req, res) => {
    try {

        const qry = { masterid: req.body.masterid, del: "N" };
        // var month = req.body.month; // Define month appropriately based on your logic
        // if (month == undefined) month = "January"
        // req.body.month && (qry.month = month); // Add month condition if present
        req.body.employee && (qry.employee = new mongoose.Types.ObjectId(req.body.employee));

        var atdqry = { masterid: req.body.masterid, del: "N" };
        // var month = req.body.month; // Define month appropriately based on your logic
        ///if (month == undefined) 
        var month = "April"
        //req.body.month && (atdqry.month = month); // Add month condition if present
        atdqry.month = month
        req.body.employee && (atdqry.employee_name = new mongoose.Types.ObjectId(req.body.employee));

        console.log('580', atdqry)

        const attsummary = await dailyatten_mast.aggregate([
            { $match: atdqry },
            {
                $lookup: {
                    from: 'leaveSchema',
                    localField: 'dalatten_atdtype',
                    foreignField: '_id',
                    as: 'leaveSchema'
                }
            },
            {
                $lookup: {
                    from: 'employeeschemas',
                    localField: 'employee_name',
                    foreignField: '_id',
                    as: 'employeeschemas'
                }
            },
            {
                $lookup: {
                    from: 'departmentSchema',
                    localField: 'employeeschemas.department',
                    foreignField: '_id',
                    as: 'departmentSchema'
                }
            },
            {
                $lookup: {
                    from: 'shiftSchema',
                    localField: 'dalatten_shiftnm',
                    foreignField: '_id',
                    as: 'shiftSchema'
                }
            },
            {
                $group: {
                    _id: {
                        lvid: "$leaveSchema._id",
                        lvname: "$leaveSchema.code",
                    },
                    dalatten_total_hour: { $sum: "$dalatten_total_hour" },
                    dalatten_overtimehrs: { $sum: "$dalatten_overtimehrs" },
                    dalatten_overtimemin: { $sum: "$dalatten_overtimemin" },
                    tot_hrs: { $sum: "$tot_hrs" },
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('644', attsummary.length)
        const salaryschema = await salary_schema.find(qry).populate('employee').populate("leave_or_group.leave_name", "discription").populate("salryhd_or_group.salaryhead_name", "salaryhead_name").sort({ _id: -1 })
        res.json({ success: true, salaryschema, attsummary });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.GetattendanceDetailsReport = async (req, res) => {
    try {
        let today = new Date();

        let formattedDate = today.toISOString();
        // const gap = getDateDifference(req.body.startDate || new Date(), req.body.endDate || new Date())
        // const qry = { masterid: req.body.masterid, del: "N" };
        // let dalatten_date = new Date(req.body.dalatten_date || formattedDate);
        // qry.dalatten_date = dalatten_date;
        // req.body.employee && (qry.employee_name = new mongoose.Types.ObjectId(req.body.employee));
        // let startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
        // let endDate = req.body.endDate ? new Date(req.body.endDate) : new Date();

        // // Add 1 day to endDate to include data up to and including that day
        // endDate.setDate(endDate.getDate() + 1);
        let startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
        let endDate = req.body.endDate ? new Date(req.body.endDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);
        const diffMilliseconds = Math.abs(endDate - startDate);

        // Convert milliseconds to days
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const gap = Math.ceil(diffMilliseconds / millisecondsPerDay);
        console.log("7890", gap)
        const qry = {
            co_code: req.body.compid,
            masterid: req.body.masterid,
            del: "N",
            dalatten_date: { $gte: startDate, $lt: endDate }
        };
        console.log(qry)

        const summary = await dailyatten_mast.aggregate([
            { $match: qry },
            {
                $lookup: {
                    from: 'leaveSchema',
                    localField: 'dalatten_atdtype',
                    foreignField: '_id',
                    as: 'leaveSchema'
                }
            },
            {
                $lookup: {
                    from: 'employeeschemas',
                    localField: 'employee_name',
                    foreignField: '_id',
                    as: 'employeeschemas'
                }
            },
            {
                $unwind: {
                    path: "$employeeschemas",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'department_master_Schema',
                    localField: 'employeeschemas.department',
                    foreignField: '_id',
                    as: 'departmentSchema'
                }
            },
            {
                $lookup: {
                    from: 'machineschemas',
                    localField: 'employeeschemas.machine',
                    foreignField: '_id',
                    as: 'machineschemas'
                }
            },
            {
                $lookup: {
                    from: 'employeecategorySchema',
                    localField: 'employeeschemas.category',
                    foreignField: '_id',
                    as: 'employeecategorySchema'
                }
            },
            {
                $lookup: {
                    from: 'shiftSchema',
                    localField: 'dalatten_shiftnm',
                    foreignField: '_id',
                    as: 'shiftSchema'
                }
            },
            {
                $group: {
                    _id: {
                        atdid: "$_id",
                        lvid: "$leaveSchema._id",
                        lvname: "$leaveSchema.discription",
                        empname: "$employeeschemas.full_name",
                        shiftname: "$shiftSchema.shift_name",
                        deptname: "$departmentSchema.description",
                        dalatten_date: "$dalatten_date",
                        tot_hrs: "$tot_hrs",
                        machineschemas: "$machineschemas.machine_name",
                        employeecategorySchema: "$employeecategorySchema.discription"
                    },
                    dalatten_total_hour: { $sum: "$dalatten_total_hour" },

                    count: { $sum: 1 }
                }
            }
        ]);
        // const Machqry = { masterid: req.body.masterid,div_code: req.body.divid, co_code: req.body.compid, del: "N" };
        const Machqry = { masterid: req.body.masterid, del: "N" };

        const shiftData = await machineSchema.find(Machqry)
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

        const CatData = await employeecategorySchema.find(Machqry)
            .select('discription')
            .exec();

        const Catvalues = await CatData.map(category => category.discription);
        const shiftDataa = await calculateShiftCounts(summary, shiftData);
        const transformedData = await transformData(shiftDataa, Catvalues, gap);

        res.json({ success: true, summary, shiftData, Catvalues, transformedData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

function getDateDifference(startDateStr, endDateStr) {
    const endDate = new Date(endDateStr);
    const startDate = new Date(startDateStr);

    // Calculate the difference in milliseconds
    const differenceMs = endDate - startDate;

    // Convert milliseconds to days and add 1 to count both start and end dates
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    return differenceDays ? differenceDays : 1;
}

function calculateShiftCounts(summarys, shiftData) {
    const shiftCounts = {};

    // Iterate through the summary array
    summarys.forEach(item => {
        // Extract relevant fields from the object
        const { lvname, machineschemas, shiftname, deptname, employeecategorySchema } = item._id;

        // Generate a key based on shiftname, machineschemas, and deptname
        const key = `${shiftname[0]}_${machineschemas[0]}_${deptname[0]}_${employeecategorySchema[0]}`;

        // Check if an object with the same key already exists
        if (!shiftCounts[key]) {
            // If it doesn't exist, create a new object
            shiftCounts[key] = {
                shift: shiftname[0],
                machine: machineschemas[0],
                department: deptname[0],
                present: 0,
                absent: 0,
                category: employeecategorySchema[0]
            };
        }

        if (lvname[0] === "Present") {
            shiftCounts[key].present++;
        }
        if (lvname[0] === "Absent") {
            shiftCounts[key].absent++;
        }
    });

    // Convert the shiftCounts object to an array of objects
    const summary = Object.values(shiftCounts);

    shiftData.forEach(entry => {
        // Loop through each machgroup object
        entry.machgroup.forEach(mach => {
            // Find the corresponding entry in the summary array
            const matchingSummary = summary.find(summaryEntry => {
                return (
                    summaryEntry.shift === mach.shift.shift_name &&
                    summaryEntry.category === mach.category.discription &&
                    summaryEntry.machine === entry.machine_name &&
                    summaryEntry.department.toUpperCase() === entry.department.description.toUpperCase()
                );
            });

            // If a matching summary entry is found, update the present field
            if (matchingSummary) {
                mach.present = matchingSummary.present;
                mach.absent = matchingSummary.absent;
            } else {
                // If no matching summary entry is found, set present to 0
                mach.present = 0;
                mach.absent = 0;
            }
        });
    });

    return shiftData;
}

function transformData(data, catVal, gap) {
    const transformedData = {};

    // Iterate over each entry in the data array
    data.forEach(entry => {
        entry.machgroup.forEach(group => {
            // Create a unique key based on shift, department, and machine
            const key = `${group.shift.shift_name}_${entry.department.description}_${entry.machine_name}`;

            // If the key doesn't exist in transformedData, initialize it
            if (!transformedData[key]) {
                transformedData[key] = {
                    Shift: group.shift.shift_name,
                    Department: entry.department.description,
                    Machine: entry.machine_name,
                };
                // Initialize categories dynamically
                catVal.forEach(category => {
                    transformedData[key][category + 'Count'] = 0;
                    transformedData[key][category + 'Present'] = 0;
                    transformedData[key][category + 'Absent'] = 0;
                    transformedData[key][category + 'Shortage'] = 0;
                });
            }

            // Update counts based on the category
            catVal.forEach(category => {
                if (group.category.discription === category) {
                    transformedData[key][category + 'Count'] += group.nos;
                    transformedData[key][category + 'Present'] += group.present;
                    transformedData[key][category + 'Absent'] += group.absent;
                    const shortage = group.nos - (group.present + group.absent);
                    transformedData[key][category + 'Shortage'] += Math.max(0, shortage);
                }
            });
        });
    });

    // Convert transformedData object to array
    const newArray = Object.values(transformedData);

    const filteredData = newArray.filter(obj => {
        return catVal.some(category => obj[category + 'Count'] > 0);
    });

    // Sort the transformed data by shift
    const sortedData = filteredData.sort((a, b) => {
        const shiftA = a.Shift.toUpperCase();
        const shiftB = b.Shift.toUpperCase();
        if (shiftA < shiftB) {
            return -1;
        }
        if (shiftA > shiftB) {
            return 1;
        }
        return 0;
    });

    // Adjust the MonthlyPresent values by the gap
    sortedData.forEach(obj => {
        catVal.forEach(category => {
            obj[category + 'Present'] = (obj[category + 'Present'] / gap).toFixed(2);
            obj[category + 'Absent'] = (obj[category + 'Absent'] / gap).toFixed(2);
            obj[category + 'Shortage'] = (Number(obj[category + 'Count']) - (Number(obj[category + 'Present']) + Number(obj[category + 'Absent']))).toFixed(2);
        });
    });

    return sortedData;
}

exports.Importdailyatten_import = async (req, res, next) => {
    try {
        var month = req.body.month;
        console.log("890", req.body.usrnm)
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }
            for (s = 0; s < step.length; s++) {

                if (step[s] != undefined && step[s]['Date'] != undefined) var date = step[s]['Date'];
                console.log("34", date);
                console.log("35", step[s]['Date']);
                var employee_name_id = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                if (step[s] != undefined && step[s]['Employee Name'] != undefined) {
                    if (step[s] != undefined && step[s]['Machine Code'] != undefined) {
                        var employee_name = await employee_master.findOne({ machine_code: step[s]['Machine Code'].toString().trim(), masterid: req.body.masterid, del: "N" });
                        if (employee_name != null) employee_name_id = employee_name._id;
                    }
                    else {
                        var employee_name = await employee_master.findOne({ full_name: step[s]['Employee Name'].toString().trim(), masterid: req.body.masterid, del: "N" });
                    }
                }
                var shift_name_id = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                if (employee_name != null) {
                    employee_name_id = employee_name._id;
                    shift_name_id = employee_name.default_shift
                }
                if (step[s] != undefined && step[s]['Shift Name'] != undefined) {
                    var shift_name = await shift_master.findOne({ shift_name: step[s]['Shift Name'].toString().trim(), masterid: req.body.masterid, del: "N" });
                    if (shift_name != null) shift_name_id = shift_name._id;
                }

                var shift_hoursssss = await shift_master.findOne({ _id: shift_name_id, masterid: req.body.masterid, del: "N" });
                if (shift_hoursssss != null) var shift_hours = shift_hoursssss?.total_hour;

                if (step[s] != undefined && step[s]['In-Time'] != undefined) var in_time = step[s]['In-Time'];
                else var in_time = "";
                if (step[s] != undefined && step[s]['Out-Time'] != undefined) var out_time = step[s]['Out-Time'];
                else var out_time = "";

                var time1 = "";
                var time2 = "";
                var hours1 = 0
                var hours2 = 0
                var mins1 = 0
                var mins2 = 0
                var hours = 0, mins = 0;

                // console.log("in_time:-", in_time)
                // console.log("out_time:-", out_time)
                if (in_time != "" && out_time != "") {
                    time1 = in_time.toString().split(':');
                    time2 = out_time.toString().split(':');

                    // console.log("in_time:-", in_time)
                    // console.log("out_time:-", out_time)
                    hours1 = parseInt(time1[0], 10),
                        hours2 = parseInt(time2[0], 10),
                        mins1 = parseInt(time1[1], 10),
                        mins2 = parseInt(time2[1], 10);
                    hours = hours2 - hours1, mins = 0;

                    // console.log("in_time:-", in_time)
                    // console.log("out_time:-", out_time)
                }


                // get hours
                if (hours < 0) hours = 24 + hours;

                // get minutes
                if (mins2 >= mins1) {
                    mins = mins2 - mins1;
                }
                else {
                    mins = (mins2 + 60) - mins1;
                    hours--;
                }

                // convert to fraction of 60
                mins = mins / 60;

                hours += mins;
                if (isNaN(hours)) hours = 0;
                else hours = hours.toFixed(2);

                // console.log(" totalhours", hours)//total hour

                var atd_type_id = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                if (step[s] != undefined && step[s]['Atd Type'] != undefined) {
                    var atd_type = await leaveSchema.findOne({ discription: step[s]['Atd Type'].toString().trim(), masterid: req.body.masterid, del: "N" });
                    if (atd_type != null) atd_type_id = atd_type._id;
                }
                if (step[s] != undefined && step[s]['Remarks'] != undefined) var remarks = step[s]['Remarks'];
                var dailyattenmast = await dailyatten_mast.find({ employee_name: employee_name_id })

                // console.log(step[s], dailyattenmast.length,employee_name_id)


                if (dailyattenmast != null && employee_name_id != "578df3efb618f5141202a196") {
                    var importdailyatten = new dailyatten_mast();
                    importdailyatten.month = month;
                    // importdailyatten.radio_typ = radio_typ;
                    if (date != undefined) {
                        var DateObject = moment(date.toString(), "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                        var datemilisecond = DateObject.format('x');
                    }
                    importdailyatten.dalatten_date = DateObject;
                    importdailyatten.dalatten_datemilisecond = datemilisecond;
                    importdailyatten.employee_name = employee_name_id;
                    importdailyatten.dalatten_shiftnm = shift_name_id;
                    importdailyatten.dalatten_intime = in_time;
                    importdailyatten.dalatten_outtime = out_time;
                    importdailyatten.dalatten_atdtype = atd_type_id;
                    importdailyatten.tot_hrs = hours;
                    importdailyatten.dalatten_total_hour = shift_hours;
                    importdailyatten.dalatten_remarks = remarks;
                    importdailyatten.entry = new Date();
                    importdailyatten.del = "N";
                    importdailyatten.user = req.body.user;
                    importdailyatten.masterid = req.body.masterid;
                    importdailyatten.co_code = req.body.compid;
                    importdailyatten.div_code = req.body.divid;
                    await importdailyatten.save()

                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'Daily Attendance Import';
                    userLog.user_op = 'Import Add';
                    userLog.entry_id = importdailyatten._id;
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
        console.log(error)
        return res.status(500).json({ error: error.message, message: 'Internal server error' });
    }
}

exports.Updatedailyatten_import = async (req, res, next) => {
    try {
        var month = req.body.month;
        console.log("890", req.body.usrnm)
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }
            for (s = 0; s < step.length; s++) {

                if (step[s] != undefined && step[s]['Date'] != undefined) var date = step[s]['Date'];
                var employee_name_id = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                if (step[s] != undefined && step[s]['Employee Name'] != undefined) {
                    if (step[s] != undefined && step[s]['Machine Code'] != undefined) {
                        var employee_name = await employee_master.findOne({ machine_code: step[s]['Machine Code'].toString().trim(), masterid: req.body.masterid, del: "N" });
                        if (employee_name != null) employee_name_id = employee_name._id;
                    }
                    else {
                        var employee_name = await employee_master.findOne({ full_name: step[s]['Employee Name'].toString().trim(), masterid: req.body.masterid, del: "N" });
                    }
                }
                var shift_name_id = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                if (employee_name != null) {
                    employee_name_id = employee_name._id;
                    shift_name_id = employee_name.default_shift
                }
                if (step[s] != undefined && step[s]['Shift Name'] != undefined) {
                    var shift_name = await shift_master.findOne({ shift_name: step[s]['Shift Name'].toString().trim(), masterid: req.body.masterid, del: "N" });
                    if (shift_name != null) shift_name_id = shift_name._id;
                }
                var shift_hoursssss = await shift_master.findOne({ _id: shift_name_id, masterid: req.body.masterid, del: "N" });
                if (shift_hoursssss != null) var shift_hours = shift_hoursssss?.total_hour;

                if (step[s] != undefined && step[s]['In-Time'] != undefined) var in_time = step[s]['In-Time'];
                else var in_time = "";
                if (step[s] != undefined && step[s]['Out-Time'] != undefined) var out_time = step[s]['Out-Time'];
                else var out_time = "";

                var time1 = "";
                var time2 = "";
                var hours1 = 0
                var hours2 = 0
                var mins1 = 0
                var mins2 = 0
                var hours = 0, mins = 0;

                // console.log("in_time:-", in_time)
                // console.log("out_time:-", out_time)
                if (in_time != "" && out_time != "") {
                    time1 = in_time.toString().split(':');
                    time2 = out_time.toString().split(':');

                    // console.log("in_time:-", in_time)
                    // console.log("out_time:-", out_time)
                    hours1 = parseInt(time1[0], 10),
                        hours2 = parseInt(time2[0], 10),
                        mins1 = parseInt(time1[1], 10),
                        mins2 = parseInt(time2[1], 10);
                    hours = hours2 - hours1, mins = 0;

                    // console.log("in_time:-", in_time)
                    // console.log("out_time:-", out_time)
                }


                // get hours
                if (hours < 0) hours = 24 + hours;

                // get minutes
                if (mins2 >= mins1) {
                    mins = mins2 - mins1;
                }
                else {
                    mins = (mins2 + 60) - mins1;
                    hours--;
                }

                // convert to fraction of 60
                mins = mins / 60;

                hours += mins;
                if (isNaN(hours)) hours = 0;
                else hours = hours.toFixed(2);

                // console.log(" totalhours", hours)//total hour

                var atd_type_id = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                if (step[s] != undefined && step[s]['Atd Type'] != undefined) {
                    var atd_type = await leaveSchema.findOne({ discription: step[s]['Atd Type'].toString().trim(), masterid: req.body.masterid, del: "N" });
                    if (atd_type != null) atd_type_id = atd_type._id;
                }
                if (step[s] != undefined && step[s]['Remarks'] != undefined) var remarks = step[s]['Remarks'];
                var dailyattenmast = await dailyatten_mast.find({ employee_name: employee_name_id })

                // console.log(step[s], dailyattenmast.length,employee_name_id)

                if (dailyattenmast != null && employee_name_id != "578df3efb618f5141202a196") {

                    if (step[s]['ID'] == null || step[s]['ID'] == undefined) {
                        console.log(s, step[s]['ID'])
                        var importdailyatten = new dailyatten_mast();
                        importdailyatten.month = month;
                        // importdailyatten.radio_typ = radio_typ;
                        if (date != undefined) {
                            var DateObject = moment(date.toString(), "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                            var datemilisecond = DateObject.format('x');
                        }
                        importdailyatten.dalatten_date = DateObject;
                        importdailyatten.dalatten_datemilisecond = datemilisecond;
                        importdailyatten.employee_name = employee_name_id;
                        importdailyatten.dalatten_shiftnm = shift_name_id;
                        importdailyatten.dalatten_intime = in_time;
                        importdailyatten.dalatten_outtime = out_time;
                        importdailyatten.dalatten_atdtype = atd_type_id;
                        importdailyatten.tot_hrs = hours;
                        importdailyatten.dalatten_total_hour = shift_hours;
                        importdailyatten.dalatten_remarks = remarks;
                        importdailyatten.entry = new Date();
                        importdailyatten.del = "N";
                        importdailyatten.user = req.body.user;
                        importdailyatten.masterid = req.body.masterid;
                        importdailyatten.co_code = req.body.compid;
                        importdailyatten.div_code = req.body.divid;
                        console.log(s, importdailyatten)
                        await importdailyatten.save()


                    }
                    else {
                        var importdailyatten = {};
                        // var importdailyatten = new dailyatten_mast();
                        importdailyatten.month = month;
                        // importdailyatten.radio_typ = radio_typ;
                        if (date != undefined) {
                            var DateObject = moment(date.toString(), "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                            var datemilisecond = DateObject.format('x');
                        }
                        importdailyatten.dalatten_date = DateObject;
                        importdailyatten.dalatten_datemilisecond = datemilisecond;
                        importdailyatten.employee_name = employee_name_id;
                        importdailyatten.dalatten_shiftnm = shift_name_id;
                        importdailyatten.dalatten_intime = in_time;
                        importdailyatten.dalatten_outtime = out_time;
                        importdailyatten.dalatten_atdtype = atd_type_id;
                        importdailyatten.tot_hrs = hours;
                        importdailyatten.dalatten_total_hour = shift_hours;
                        importdailyatten.dalatten_remarks = remarks;
                        importdailyatten.entry = new Date();
                        importdailyatten.del = "N";
                        importdailyatten.user = req.body.user;
                        importdailyatten.masterid = req.body.masterid;
                        importdailyatten.co_code = req.body.compid;
                        importdailyatten.div_code = req.body.divid;
                        let query = { _id: step[s]['ID'] }
                        var empupdate = await dailyatten_mast.findOneAndUpdate(query, importdailyatten)

                    }
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'Daily Attendance Import';
                    if (step[s]['ID'] == null || step[s]['ID'] == undefined) userLog.user_op = 'Import Add With Update';
                    else userLog.user_op = 'Import Update Add';
                    userLog.entry_id = importdailyatten._id;
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
        console.log(error)
        return res.status(500).json({ error: error.message, message: 'Internal server error' });
    }
}

exports.GetAbsentReport = async (req, res) => {
    try {
        console.log(req.body)
        let startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
        let endDate = req.body.endDate ? new Date(req.body.endDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        const qry = { dalatten_atdtype: new mongoose.Types.ObjectId("64ba55757a141c36340cc6c7"), div_code: req.body.divid, co_code: req.body.compid, masterid: req.body.masterid, del: "N", dalatten_date: { $gte: startDate, $lt: endDate } };
        var month = req.body.month;
        req.body.employee && (qry.employee_name = new mongoose.Types.ObjectId(req.body.employee));

        const currentPage = req.body.currentPage || 1; // Extract current page from the request body
        const rowsPerPage = 1000;// req.body.rowsPerPage || 10; // Extract rows per page from the request body        
        const skip = 0; // (currentPage - 1) * rowsPerPage; // Calculate skip value for pagination

        const summarycount = await dailyatten_mast.find(qry, { _id: 1 });

        const summary = await dailyatten_mast.aggregate([
            { $match: qry },
            {
                $lookup: {
                    from: 'leaveSchema',
                    localField: 'dalatten_atdtype',
                    foreignField: '_id',
                    as: 'leaveSchema'
                }
            },
            {
                $lookup: {
                    from: 'employeeschemas',
                    localField: 'employee_name',
                    foreignField: '_id',
                    as: 'employeeschemas'
                }
            },
            {
                $lookup: {
                    from: 'department_master_Schema',
                    localField: 'employeeschemas.department',
                    foreignField: '_id',
                    as: 'departmentSchema'
                }
            },
            {
                $lookup: {
                    from: 'shiftSchema',
                    localField: 'dalatten_shiftnm',
                    foreignField: '_id',
                    as: 'shiftSchema'
                }
            },
            { $skip: skip }, // Skip documents based on current page
            { $limit: rowsPerPage }, // Limit documents based on rows per page
            {
                $group: {
                    _id: {
                        lvid: "$leaveSchema._id",
                        lvname: "$leaveSchema.discription",
                        empname: "$employeeschemas.full_name",
                        machine_code: "$employeeschemas.machine_code",
                        shiftname: "$shiftSchema.shift_name",
                        deptname: "$departmentSchema.description",
                    },
                    dalatten_total_hour: { $sum: "$dalatten_total_hour" },

                    count: { $sum: 1 }
                }
            },
            { $sort: { employee_name: 1 } }
        ]);

        const filteredSummary = await summary.filter(item => item.count >= req.body.SelectedDay);

        const result = await filteredSummary.map(item => ({
            empname: item._id.empname[0],
            machine_code: item._id.machine_code[0],
            shiftname: item._id.shiftname[0],
            deptname: item._id.deptname[0],
            count: item.count
        }));

        res.json({ success: true, summary: result, summarycount: result.length });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.GetAllEmpAttendanceDetail = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 0;
        const pageSize = parseInt(req.body.pageSize) || 10;
        const skip = (page) * pageSize;

        const qry = { masterid: req.body.masterid, del: "N", };
        var month = req.body.Month; // Define month appropriately based on your logic
        req.body.Month && (qry.month = month); // Add month condition if present
        //req.body.employee && (qry.employee_name = new mongoose.Types.ObjectId(req.body.employee));

        console.log(req.body,req.query.search)

        let searchStr = {};
        let empsearchStr = {};
         if (req.query.search) {
             const regex = new RegExp(req.query.search, "i");
             if (!isNaN(Number(req.query.search))) {
                 empsearchStr = {
                     $or: [
                         { 'machine_code': req.query.search },
                         { 'mobile_no': req.query.search },
                     ]
                 };
             } else {
                empsearchStr = {
                    $or: [
                        { 'full_name': regex },
                        { 'machine_code': regex },
                    ]
                };
        
            }
        }

        console.log('empsearchStr',empsearchStr)
        const emp = await employeeschemas.find(empsearchStr, { discription: 1 });
        const emparr = emp.map(d => d._id);

        searchStr = Object.assign(searchStr, qry);
        searchStr = Object.assign(searchStr, { employee_name: { $in:emparr } });
                        // ,


        console.log('1562 searchStr', searchStr)
        const summary = await dailyatten_mast.aggregate([
            { $match: searchStr },
            {
                $lookup: {
                    from: 'leaveSchema',
                    localField: 'dalatten_atdtype',
                    foreignField: '_id',
                    as: 'leaveSchema'
                }
            },
            {
                $lookup: {
                    from: 'employeeschemas',
                    localField: 'employee_name',
                    foreignField: '_id',
                    as: 'employeeschemas'
                }
            },
            {
                $lookup: {
                    from: 'departmentSchema',
                    localField: 'employeeschemas.department',
                    foreignField: '_id',
                    as: 'departmentSchema'
                }
            },
            {
                $lookup: {
                    from: 'shiftSchema',
                    localField: 'dalatten_shiftnm',
                    foreignField: '_id',
                    as: 'shiftSchema'
                }
            },
            {
                $group: {
                    _id: "$employeeschemas.full_name",
                    details: {
                        $push: {
                            atdid: "$_id",
                            lvname: "$leaveSchema.code",
                            empname: "$employeeschemas.full_name",
                            shiftname: "$shiftSchema.shift_name",
                            deptname: "$departmentSchema.discription",
                            dalatten_intime: "$dalatten_intime",
                            dalatten_outtime: "$dalatten_outtime",
                            dalatten_date: "$dalatten_date",
                            dalatten_datemilisecond: "$dalatten_datemilisecond",
                            dalatten_overtimehrs: "$dalatten_overtimehrs",
                            dalatten_overtimemin: "$dalatten_overtimemin",
                            tot_hrs: "$tot_hrs"
                        }
                    },
                    total_hours: { $sum: "$dalatten_total_hour" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }, // Sort by employee name
            // { $skip: skip },
            // { $limit: pageSize }
        ]);



        console.log('ln',summary.length,skip,pageSize)

        const summaryArray = summary.map(item => ({
            employee: item._id,
            details: item.details,
            total_hours: item.total_hours,
            count: item.count
        }));

        res.json({ success: true, summary: summaryArray });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.UpdateAttendanceByEmployee = async (req, res) => {
    try {
        const data = req.body.data;
        for (let i = 0; i < data.length; i++) {
            const attendance = data[i];
            const { atdid, lvname, shiftname, dalatten_intime, dalatten_outtime } = attendance;
            const state_mast = {
                "edit_by": req.body.usrnm,
                "dalatten_shiftnm": shiftname,
                "dalatten_intime": dalatten_intime,
                "dalatten_outtime": dalatten_outtime,
                "dalatten_atdtype": lvname,
                "status": "Pending"
            };

            const query = { _id: atdid };
            await dailyatten_mast.updateOne(query, state_mast);

            const Authdata = await autho_setup.findOne({ module_name: "Attendance List" });
            const authoLog_entry = new Date();

            for (const item of Authdata.rolesetup) {
                try {
                    let autholog_mast = new autho_log();
                    autholog_mast.module_name = "Attendance List";
                    autholog_mast.approved = "No";
                    autholog_mast.request_date = moment(authoLog_entry).tz("Asia/Kolkata");
                    autholog_mast.request_datemilisecond = moment(authoLog_entry).tz("Asia/Kolkata").format('x');
                    autholog_mast.usrnm = req.body.usrnm;
                    autholog_mast.co_code = req.body.compid;
                    autholog_mast.div_code = req.body.divid;
                    autholog_mast.requestuser_name = req.body.usrnm;
                    autholog_mast.role = item.role;
                    autholog_mast.authouser_name = item.user;
                    autholog_mast.sno = 0;
                    autholog_mast.leave_request = atdid;
                    await autholog_mast.save();

                } catch (error) {
                    console.error('Error:', error);
                }
            }

            const userLog = new user_log();
            userLog.user_name = req.body.usrnm;
            userLog.module_name = 'dailyatten_mast';
            userLog.user_op = 'U';
            userLog.entry_id = atdid;
            const userLog_entry = new Date();
            const userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
            const entrydatemilisecond = userDateObject.valueOf();
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();
        }
        res.json({ status: true, message: 'Update Request Successful' });
    } catch (err) {
        console.error(err);
        res.status(200).json({ status: false, error: err.message, message: 'Oops Caught an error.' });
    }
};

exports.AddAttendanceByEmployee = async (req, res) => {
    try {
        const shift_hoursssss = await shift_master.findOne({ _id: req.body.dalatten_shiftnm, masterid: req.body.masterid, del: "N" });
        let state_mast = new dailyatten_mast();
        state_mast.employee_name = req.body.employee_name;
        state_mast.dalatten_shiftnm = req.body.dalatten_shiftnm;
        state_mast.dalatten_intime = req.body.dalatten_intime;
        state_mast.dalatten_outtime = req.body.dalatten_outtime;
        state_mast.dalatten_atdtype = req.body.dalatten_atdtype;
        state_mast.dalatten_total_hour = shift_hoursssss?.total_hour;
        state_mast.tot_hrs = req.body.dalatten_total_hour;
        state_mast.dalatten_date = req.body.dalatten_date;
        state_mast.month = req.body.month;
        state_mast.status = "Pending";

        state_mast.user = req.body.usrnm;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.format('x');
        state_mast.entry = entryDateObject;
        state_mast.dalatten_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';
        await state_mast.save();

        const Authdata = await autho_setup.findOne({ module_name: "Attendance List" });
        const authoLog_entry = new Date();

        for (const item of Authdata.rolesetup) {
            try {
                let autholog_mast = new autho_log();
                autholog_mast.module_name = "Attendance List";
                autholog_mast.approved = "No";
                autholog_mast.request_date = moment(authoLog_entry).tz("Asia/Kolkata");
                autholog_mast.request_datemilisecond = moment(authoLog_entry).tz("Asia/Kolkata").format('x');
                autholog_mast.usrnm = req.body.usrnm;
                autholog_mast.co_code = req.body.compid;
                autholog_mast.div_code = req.body.divid;
                autholog_mast.requestuser_name = req.body.usrnm;
                autholog_mast.role = item.role;
                autholog_mast.authouser_name = item.user;
                autholog_mast.sno = 0;
                autholog_mast.leave_request = state_mast?._id;
                await autholog_mast.save();

            } catch (error) {
                console.error('Error:', error);
            }
        }

        const userLog = new user_log();
        userLog.user_name = req.body.usrnm;
        userLog.module_name = 'Daily Attendance';
        userLog.user_op = 'A'; // Assuming 'A' stands for 'Add'
        userLog.entry_id = state_mast._id; // Use the newly created attendance ID
        const userLog_entry = new Date();
        const userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
        const entrydatemiliseconds = userDateObject.valueOf();
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemiliseconds;
        await userLog.save();

        res.json({ status: true, message: 'Add Request Successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, error: 'Internal server error', message: 'Oops, something went wrong.' });
    }
};

exports.AttendanceFileDownload = async (req, res) => {
    try {


        var qry = { co_code: req.body.compid, div_code: req.body.divid, del: "N" };

        qry = Object.assign(qry, { resign: null });


        var results = await employee_master.find(qry, 'full_name machine_code filepath filename loangroup designation department gross_sal salary mobile_no')
            .populate("designation", "discription")
            .populate("department", "description");

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("attendance");
        const path = "./files";

        worksheet.columns = [
            { header: "Date", key: "Date" },
            { header: "Employee Name", key: "EmployeeName" },
            { header: "Atd Type", key: "Atd Type" },
            { header: "In-Time", key: "In-Time" },
            { header: "Out-Time", key: "Out-Time" },
            { header: "Remarks", key: "Remarks" },
        ]

        console.log('1748', results.length)
        let counter = 1;

        results.forEach((user) => {
            //counter
            console.log(counter, user.EmployeeName)
            user.EmployeeName = user.full_name;
            worksheet.addRow(user);
            counter++;
        });

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });

        try {
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader("Content-Disposition", `attachment; filename=attendancefile.xlsx`);

            return workbook.xlsx.write(res).then(() => {
                res.status(200);
            });

        } catch (err) {
            res.send({
                status: "error",
                message: "Something went wrong",
            });
        }

        // const filename = await AttendanceGenrateFile();;
        // const filePath = path.join(__dirname, '..', '..', 'uploads', filename); 

        // fs.stat(filePath, (err, stats) => {
        //     if (err || !stats.isFile()) {
        //         return res.status(404).send('File not found');
        //     }

        //     const readStream = fs.createReadStream(filePath);

        //     res.setHeader('Content-Type', 'application/octet-stream');
        //     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        //     readStream.pipe(res);
        // });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};