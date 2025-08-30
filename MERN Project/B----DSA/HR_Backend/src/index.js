require('dotenv').config()
const express = require("express")
const cors = require('cors');
const path = require('path');

const app = express();
const authenticate=require("./middleware/authenticat")
app.use('/uploads', express.static('uploads'));

app.use(express.json())
const multer = require("multer") 
const corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.1.7:3000', 'http://192.168.1.5:3002'],
  };
  
// app.use(cors(corsOptions));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => {
    return res.status(200).send({ message: "welcome to softHR api - node" })
})

const authRouter = require("./routes/auth.routes")
const companyRouter = require("./routes/company.routes")
const employeegrade_masterRouter = require("./routes/employeegrade_master.routes")
const salarymasterRouter = require("./routes/salarymaster.routes")
const shiftmasterRouter = require("./routes/shiftmaster.routes")
const attendanceRouter = require("./routes/attandance.routes")
const employeeRouter = require("./routes/employee.routes")
const advanceRouter = require("./routes/advance.routes")
const salart_handleRouter = require("./routes/salary_handle.routes")
const prductionRouter = require("./routes/production.routes")
const user_rightsRouter = require("./routes/user_rights.routes")
const leave_reqsRouter = require("./routes/leave_req.routes")
const taskRouter = require("./routes/task.routes")
const LoanRouter = require("./routes/loan_req.routes")

// ----------------------------------------
const Masters = require("./routes/masters.routs")

app.use("/auth", authRouter)
app.use("/employeegrade_master",authenticate,employeegrade_masterRouter)
app.use("/company", authenticate,companyRouter)
app.use("/salary_master",authenticate, salarymasterRouter)
app.use("/shift_master",authenticate, shiftmasterRouter)
app.use("/attendance",authenticate, attendanceRouter)
app.use("/employee",authenticate, employeeRouter)
app.use("/advance",authenticate, advanceRouter)
app.use("/salart_handleRouter",authenticate, salart_handleRouter)
app.use("/production",authenticate, prductionRouter)
app.use("/user_rights",authenticate, user_rightsRouter)
app.use("/leave_reqsRouter",authenticate, leave_reqsRouter)
app.use("/task",authenticate, taskRouter)
app.use("/loan_reqs",authenticate, LoanRouter)
// --------------------------------------------------
app.use("/masters",authenticate, Masters)

module.exports = { app };