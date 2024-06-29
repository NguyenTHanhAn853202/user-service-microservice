const {register,login, logout,verifyPhoneNumber, verifyEmail} = require('../controller/index.controller');
const { verifySignup, verifyAccount,authentication } = require('../middlware');

const router = require('express').Router();

router.get("/verify-account/:token",verifyEmail)

router.post("/register",[verifySignup],register)
router.post("/login",[verifyAccount],login)
router.post("/verify-phone-number",verifyPhoneNumber)

module.exports = router;