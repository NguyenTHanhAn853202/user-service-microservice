const {sign,verify} = require('./jwt');
const sendEmail = require("./sendEmail")

module.exports = {verify, sign,sendEmail}