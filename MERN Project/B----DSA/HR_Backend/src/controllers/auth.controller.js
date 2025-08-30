const jwtProvider = require("../config/jwtProvider.js")
const User = require('../models/user.model.js');
const { ObjectId } = require('mongodb'); // Import ObjectId from MongoDB
const employeeschemas = require('../models/employeeSchema.js');
const Company = require('../models/company.model.js');
const DivSchema = require('../models/divSchema.js');
const masterlogin = require('../models/masterSchema');
const mailService = require('../controllers/common.js')
const cron = require('node-cron');
const moment = require('moment-timezone');
const dailyatten_mast = require('../models/attenSchema.js');
const accountSchema = require('../models/accountSchema.js');

const crypto = require('crypto');
const bcrypt = require('bcrypt');

const PasswordResetToken = require('../models/passwordResetTokenSchema.js'); // PasswordResetToken model

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ emailid: { $regex: new RegExp('^' + email + '$', 'i') } });

    if (!user) {
        return res.status(200).json({ message: 'If the email exists, a password reset link has been sent.' });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const tokenExpiry = Date.now() + 3600000; // 1 hour expiration

    // Store token in database
    await PasswordResetToken.create({
        user_id: user._id,
        token: hashedToken,
        token_expiry: tokenExpiry
    });

    // Send email to user with the reset link
    const resetUrl = `https://example.com/reset-password?token=${resetToken}`;

    // await sendResetEmail(user.email, resetUrl);
    await mailService.sendResetEmail(user?.emailid, resetUrl)
    res.status(200).json({ message: 'If the email exists, a password reset link has been sent.' });
};

const getLvnameCounts = (summary) => {
    const lvnameCounts = {};
    summary.forEach(item => {
        const { _id, count } = item;
        const lvname = _id.lvname[0];
        if (!lvnameCounts[lvname]) {
            lvnameCounts[lvname] = count;
        } else {
            lvnameCounts[lvname] += count;
        }
    });
    return lvnameCounts;
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
            { $project: { div_code: "$div_code", div_mast: "$div_mast", ac_email: "$ac_email" } }
        ]);

        const divisionsWithoutObjectId = removeObjectId(lastEntryNo);

        return divisionsWithoutObjectId;
    } catch (err) {
        console.error(err);
        return []
    }
};

exports.DivisionsGET = async (req, res) => {
    try {
        const results = [];
        const data = await DivisionsGET();
        for (const item of data) {
            const qry = { div_code: item._id, del: "N" };

            var date = new Date("2024-04-10");
            var DateObject = moment(date).tz("Asia/Kolkata");

            var startOfDay = DateObject.clone().startOf('day').valueOf();
            var endOfDay = DateObject.clone().endOf('day').valueOf();

            const Todayqry = {
                div_code: item._id,
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

            results.push({ _id: item._id, div_code: item.div_code, div_mast: item.div_mast, ac_email: item.ac_email, Todaysummary });
        }
        const arrayOfObjects = results.map(item => {
            const { _id, div_code, div_mast, ac_email, Todaysummary } = item;
            const lvnameCounts = getLvnameCounts(Todaysummary);
            return {
                _id,
                div_code,
                div_mast,
                ac_email,
                ...lvnameCounts
            };
        });

        res.json({ success: true, arrayOfObjects });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await User.findOne({ usrnm: { $regex: new RegExp('^' + username + '$', 'i') } });
        let employeeMaster;

        if (!isNaN(username)) {
            employeeMaster = await accountSchema.findOne({ MobileNo: username });
        }
        // Check if neither user nor employeeMaster exists
        if (!user && !employeeMaster) {
            return res.status(404).json({ status: false, message: 'User not found with Username or Mobile number', username });
        }

        const validUser = user || employeeMaster;
        if (password !== validUser.usrpwd) {
            return res.status(401).json({ status: false, message: 'Invalid password' });
        }

        const jwt = jwtProvider.generateToken(validUser._id);
        const message = user ? "Login success" : "Employee login success";

        return res.status(200).json({ status: true, jwt, message, user: validUser });

    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: false, error: error.message })
    }
}

exports.register = async (req, res) => {
    const { email, mobileNo, division, company } = req.body;
    const currentDate = new Date();

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    firstDayOfMonth.setHours(firstDayOfMonth.getHours(), firstDayOfMonth.getMinutes());

    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    lastDayOfMonth.setHours(lastDayOfMonth.getHours(), lastDayOfMonth.getMinutes());

    try {
        const existingEmail = await masterlogin.findOne({ custname: { $regex: new RegExp('^' + email + '$', 'i') } });
        if (existingEmail) {
            return res.status(200).json({ status: false, message: 'Email Already Registered.' });
        }

        const newMaster = new masterlogin({
            custname: email,
            emp_limit: 10
        });

        await newMaster.save();

        const existingCompany = await Company.findOne({ com_name: { $regex: new RegExp('^' + company + '$', 'i') } });
        const existingDivision = await DivSchema.findOne({ div_mast: { $regex: new RegExp('^' + division + '$', 'i') } });

        if (existingCompany && existingDivision) {
            return res.status(200).json({ status: false, message: 'Duplicate Company and Division Name' });
        }

        if (existingCompany) {
            return res.status(200).json({ status: false, message: 'Duplicate Company Name' });
        }

        if (existingDivision) {
            return res.status(200).json({ status: false, message: 'Duplicate Division Name' });
        }

        const newCompany = new Company({
            com_name: company,
            sdate: firstDayOfMonth.toISOString(),
            edate: lastDayOfMonth.toISOString(),
            mast_nm: "A",
            Dealer_miscsno: "A",
            masterid: newMaster._id,
            Q_T_K: "A",
            __v: 0
        });

        const newDivision = new DivSchema({
            div_mast: division,
            div_code: generateCompanyCode(division),
            ac_interfclanguge: "EN-English",
            masterid: newMaster._id,
            __v: 0,
        });

        await newCompany.save();
        await newDivision.save();
        const otp = await generateOTP();

        const newUser = new User({
            usrnm: email,
            usrpwd: otp,
            emailid: email,
            phone_num: mobileNo,
            co_code: [newCompany._id],
            div_code: [newDivision._id],
            administrator: "Yes",
            masterid: newMaster._id,
            __v: 0,
        });

        await newUser.save();

        const findUser = {
            email: email
        }

        const sendEmail = await mailService.sendOTP(otp, findUser)

        return res.status(201).json({ status: true, message: 'Registration successful' });

    } catch (error) {
        return res.status(500).json({ status: false, error: error.message });
    }
}

exports.callbackReq = async (req, res) => {
    const { name, number, email, staff } = req.body
    try {
        const details = {
            name,
            number,
            staff,
            email
        }

        const sendEmail = await mailService.sendCallRequestMail(details)

        return res.status(201).json({ status: true, message: 'Registration successful' });

    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: false, error: error.message })
    }
}

function generateCompanyCode(companyName) {
    const words = companyName.split(' ');

    let code = '';

    for (let i = 0; i < words.length; i++) {
        code += words[i][0].toUpperCase();
    }

    return code;
}

exports.companyByUser = async (req, res) => {
    const { co_code } = req.body
    try {
        const co_codeObjectIds = co_code.map(id => new ObjectId(id));

        const company = await Company.find({ _id: { $in: co_codeObjectIds } });
        if (!company) {
            return res.status(404).json({ status: false, message: 'companies not found' });
        }
        return res.status(200).send({ status: true, company });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

const generateOTP = async () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    return otp;
}