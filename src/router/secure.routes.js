const router = require('express').Router();
const verifyModifyPassword = require("../middlware/verifyModifyPassword")
const {modifyPassword, logout, information} = require("../controller/index.controller");

router.post("/logout",logout)
router.put("/update-information",information)
router.patch("/modify-password",[verifyModifyPassword],modifyPassword)

module.exports = router;