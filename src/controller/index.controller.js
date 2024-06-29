const register = require('./register.controller')
const login = require('./login.controller')
const modifyPassword = require('./modifyPassword.controller')
const logout = require('./logout.controller')
const information = require('./information.controller')
const {verifyEmail,verifyPhoneNumber} = require('./verifyAccount.controller')

module.exports = {register,login,modifyPassword,logout,information,verifyEmail,verifyPhoneNumber}