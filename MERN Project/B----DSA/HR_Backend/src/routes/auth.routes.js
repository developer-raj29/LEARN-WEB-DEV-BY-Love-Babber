const express = require("express");

const router = express.Router();
const authController = require("../controllers/auth.controller.js")
const multer = require("multer")
const upload = multer({ dest: 'uploads/' });

router.post("/signin", authController.login)
// router.post("/code_co",authController.companyByUser)
router.post("/register", authController.register)
router.post("/callbackReq", authController.callbackReq)

module.exports = router;