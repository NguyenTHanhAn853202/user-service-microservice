const nodemailer = require('nodemailer');
const PASSWORD_EMAIL = process.env.PASSWORD_EMAIL

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: 'nguyenthanhan12@dtu.edu.vn',
        pass: PASSWORD_EMAIL
    }
})

const sendEmail = async(mailOptions)=>{
    try {
        const options = {...mailOptions,from:"nguyenthanhan12@dtu.edu.vn"}
        const reponse = await transporter.sendMail(options)
        return reponse
    } catch (error) {
        return false
    }
}

module.exports = sendEmail