const nodemailer = require('nodemailer');
const template = require('../template/templates.service')
const cron = require('node-cron');
const DivSchema = require('../models/divSchema.js');
const dailyatten_mast = require('../models/attenSchema.js');
const moment = require('moment-timezone');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Change this to your email service provider (e.g., Outlook, SendGrid, etc.)
  auth: {
    user: 'ravi.softsolutions@gmail.com', // Replace with your email address
    pass: 'jnjdgjstlrdgahcm', // Replace with your email password or an app password
  },
  secure: false,
  requireTLS: false,
  tls: { rejectUnauthorized: false },
  default: { from: 'Vidhi Rice <ravi.softsolutions@gmail.com>', }
});

async function sendOTP(otp, userInfo) {
  try {
    return await transporter.sendMail({
      from: 'Stafflicity <ravi.softsolutions@gmail.com>',
      to: userInfo.email,
      subject: "Welcome to Stafflicity! Your Registration is Complete.",
      html: await template.forgotpasswortTemp(otp, userInfo),
      context: { name: 'Registration Password' }
    })
  } catch (error) {
    console.log(error)
  }
}

async function sendResetEmail(emailid, url) {
  try {
    return await transporter.sendMail({
      from: 'Stafflicity <ravi.softsolutions@gmail.com>',
      to: emailid,
      subject: "Your Stafflicity password link is ready.",
      html: await template.resetpasswortTemp(emailid, url),
      context: { name: 'Password reset link' }
    })
  } catch (error) {
    console.log(error)
  }
}

async function sendTaskMail(user,userInfo) {
  try {
    return await transporter.sendMail({
      from: 'Stafflicity <ravi.softsolutions@gmail.com>',
      to: user?.email.trim(),
      subject: "New Task",
      html: await template.TaskTemp(user, userInfo),
      context: { name: 'New Task' }
    })
  } catch (error) {
    console.log(error)
  }
}

async function sendCallRequestMail(details) {
  try {
    return await transporter.sendMail({
      from: 'Stafflicity <ravi.softsolutions@gmail.com>',
      to: "ajitrathore997@gmail.com",
      subject: "Callback Request",
      html: await template.CallBackTemp(details),
      context: { name: 'Callback Request' }
    })
  } catch (error) {
    console.log(error)
  }
}

const getLvnameCounts = (summary) => {
  const lvnameCounts = {};
  let totalCount = 0;
  let notMarkedCount = 0;
  summary.forEach(item => {
    const { _id, count } = item;
    const lvname = _id.lvname[0];
    if (lvname === undefined) {
      notMarkedCount += count;
    } else {
      if (!lvnameCounts[lvname]) {
        lvnameCounts[lvname] = count;
      } else {
        lvnameCounts[lvname] += count;
      }
    }
    totalCount += count;
  });
  return { lvnameCounts, notMarkedCount, totalCount };
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
      { $project: { div_code: "$div_code", div_mast: "$div_mast", ac_email: "$ac_email", ac_pho: "$ac_pho" } }
    ]);

    const divisionsWithoutObjectId = removeObjectId(lastEntryNo);

    return divisionsWithoutObjectId;
  } catch (err) {
    console.error(err);
    return []
  }
};

const DailyAtten = async () => {
  try {
    const results = [];
    const data = await DivisionsGET();
    for (const item of data) {
      const qry = { div_code: item._id, del: "N" };

      var date = new Date(moment().format('YYYY-MM-DD'));
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

      results.push({ _id: item._id, div_code: item.div_code, div_mast: item.div_mast, ac_email: item.ac_email, ac_pho: item.ac_pho, Todaysummary });
    }
    const arrayOfObjects = results.map(item => {
      const { _id, div_code, div_mast, ac_email, Todaysummary, ac_pho } = item;
      const { lvnameCounts, totalCount, notMarkedCount } = getLvnameCounts(Todaysummary);
      return {
        _id,
        div_code,
        div_mast,
        ac_email,
        ac_pho,
        notMarkedCount,
        totalCount,
        ...lvnameCounts
      };
    });
    return arrayOfObjects;
    // res.json({ success: true, arrayOfObjects });

  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

async function sendMail(email, details) {
  try {
    return await transporter.sendMail({
      from: 'Stafflicity <ravi.softsolutions@gmail.com>',
      to: email,
      subject: "Welcome to Stafflicity! Your Attendance.",
      html: await template.attenTemp(details),
      context: { name: 'Attendance' }
    })
  } catch (error) {
    console.log(error)
  }
}

const EmailCron = async () => {
  console.log('Sending emails...');
  const data = await DailyAtten();
console.log(data);
  data.map(async (item) => {
    try {
      if (item?.ac_email) {
        console.log(item.ac_email);
        const sendEmail = await sendMail(item?.ac_email, item)
        console.log(`sent mail to ${item?.div_mast}`)
      }
    } catch (error) {
      console.log(error)
    }
  })
}

cron.schedule('0 22 * * *', async () => {
  try {
  console.log('Running Email cron job');
  
  await EmailCron();
  console.log('Done  Email cron job');

} catch (error) {
  console.log(error)
}
});

module.exports = { sendOTP, sendTaskMail,sendCallRequestMail, sendResetEmail};