const User = require("../model/user")
const { sign, sendEmail } = require("../utils")
const twilio = require("twilio")

const ACCESS_KEY = process.env.ACCESS_TOKEN || "abcd"
const REFRESH_KEY = process.env.REFRESH_TOKEN || "efgh"
const ACCOUNT_SID = process.env.ACCOUNT_SID
const AUTH_TOKEN = process.env.AUTH_TOKEN
const SERVICE_SID = process.env.SERVICE_SID
const VERIFY_ACCESS_KEY = process.env.VERIFY_ACCOUNT||"verify_account"



const register = async(req,res,next)=>{
    try {
        const {username,password} = req.body
        const existsUser = await User.exists({username: username})
        if(existsUser) return res.status(403).json({
            success:false,
            message:"username already exists"
        })
        const user = new User({username:username,password:password})
        user.save()
        const tokenVerify = sign({username:username},VERIFY_ACCESS_KEY,60*5)
        const emailRegex = /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/
        if(emailRegex.test(username)){
            const mailOptions = {
                to:username,
                subject:"Verify your account",
                html:`<h1>Hello ${username}</h1>
                    <p>Please click on the link below to verify your account</p>
                   <a href="http://localhost:3000/api/user/verify-account/${tokenVerify}">Verify your account</a>`
            }
            sendEmail(mailOptions)
            }
            else{
                const client = twilio(ACCOUNT_SID,AUTH_TOKEN)
                client.verify.v2.services(SERVICE_SID)
                .verifications
                .create({to: '+84'+ username, channel: 'sms'})
                .then(verification => console.log(verification.status));
            }
        return res.status(200).json({
            success:true,
            message:"Please verify your account"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        
        })
    }

}

module.exports = register