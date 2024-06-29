const User = require("../model/user")
const { sign,sendEmail } = require("../utils")
const twilio = require("twilio")
const ACCESS_KEY = process.env.ACCESS_TOKEN||'abcd'
const REFRESH_KEY = process.env.REFRESH_TOKEN||"efgh"
const VERIFY_ACCESS_KEY = process.env.VERIFY_ACCOUNT||"verify_account"
const ACCOUNT_SID = process.env.ACCOUNT_SID
const AUTH_TOKEN = process.env.AUTH_TOKEN
const SERVICE_SID = process.env.SERVICE_SID


const login = async(req,res,next) => {
    try {
        const {username='',password=''} = req.body
        const userFound = await User.findOne({username: username})
        if(!userFound) return res.status(401).json({
            success:false,
            message:"Invalid username or password"
        })
        const comparePassword = await User.comparePassword(password,userFound.password)
        if(!comparePassword) return res.status(401).json({
            success:false,
            message:"Invalid username or password"
        })
        if(!userFound.verify){
            const tokenVerify = sign({username:username,_id:userFound._id},VERIFY_ACCESS_KEY,60*5)
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
            return res.status(401).json({
                success:false,
                message:"Please verify your account"
            })
        }
        const token = sign({username:userFound.username,_id:userFound._id},ACCESS_KEY,60*60)
        const refreshToken = sign({username:userFound.username,_id:userFound._id},REFRESH_KEY)
        userFound.token = [...userFound.token,refreshToken]
        userFound.save()
        res.cookie("token",token)
        res.cookie("refresh_token",refreshToken)
        return res.status(200).json({
            success:true,
            message:"user logged in successfully",
            data:{
                token:token,
                refreshToken:refreshToken
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = login