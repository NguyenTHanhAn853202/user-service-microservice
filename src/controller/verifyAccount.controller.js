const User = require("../model/user");
const { verify, sign } = require("../utils");
const twilio = require("twilio")
const producer = require("../messageQueue/producer");
const { verify_email_success } = require("../messageQueue/queueTask");
const ACCOUNT_SID = process.env.ACCOUNT_SID
const AUTH_TOKEN = process.env.AUTH_TOKEN
const SERVICE_SID = process.env.SERVICE_SID
const ACCESS_KEY = process.env.ACCESS_TOKEN || "abcd"
const REFRESH_KEY = process.env.REFRESH_TOKEN || "efgh"

const VERIFY_ACCESS_KEY = process.env.VERIFY_ACCOUNT||"verify_account"

const htmlVerifySuccess = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification Success</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 40px;
                            background-color: #f4f4f9;
                            color: #333;
                            text-align: center;
                            padding: 20px;
                        }
                        .success-message {
                            background-color: #e0f7fa;
                            color: #00796b;
                            border: 1px solid #00796b;
                            padding: 20px;
                            border-radius: 5px;
                            display: inline-block;
                        }
                    </style>
                </head>
                <body>
                    <div class="success-message">
                        <h1>Email Verification Successful!</h1>
                        <p>Your email has been successfully verified. Thank you for confirming your email address.</p>
                    </div>
                </body>
                </html>
                `
const htmlVerifyFail = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification Failed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #fff3e0;
            color: #d32f2f;
            text-align: center;
            padding: 20px;
        }
        .error-message {
            background-color: #ffebee;
            color: #d32f2f;
            border: 1px solid #d32f2f;
            padding: 20px;
            border-radius: 5px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="error-message">
        <h1>Email Verification Failed</h1>
        <p>We were unable to verify your email address. Please ensure the link is correct or contact support for assistance.</p>
    </div>
</body>
</html>
`

const verifyEmail = async(req,res,next)=>{
    try{
        const token = req.params.token
        const decoded = verify(token,VERIFY_ACCESS_KEY)
        if(!decoded) return res.status(400).send(htmlVerifyFail)
        const username = decoded.username
        const exist = await User.exists({username:username,verify:true})
        if(exist){
            return res.status(400).send(htmlVerifyFail)
        }
        const accessToken = sign({username:username},ACCESS_KEY,60*5)
        const refreshToken = sign({username:username},REFRESH_KEY)
        const userUpdate = await User.updateOne({username: username},{verify:true,$push:{token:refreshToken}})
        const message = {
            status:"OK",
            message:"User verified successfully",
            code:200,
            data:{
                token:accessToken,
                refreshToken:refreshToken
            }
        }
        await producer.sendMessage(verify_email_success,message)
        if(userUpdate.acknowledged && userUpdate.modifiedCount>0 ){
           
            return res.status(200).send(htmlVerifySuccess)
        }
            
        return res.status(400).send(htmlVerifyFail)
    }
    catch(error){
        return res.status(400).send(htmlVerifyFail)
    }
}

const verifyPhoneNumber = async(req,res)=>{
    try{
        const {phoneNumber='',code=''} = req.body
        const client = twilio(ACCOUNT_SID,AUTH_TOKEN)
        const verifySMS = await client.verify.v2.services(SERVICE_SID).verificationChecks.create({to:`+84${phoneNumber}`,code:code})
        if(!verifySMS.valid) return res.status(401).json({success:false, message:"The code is not correct"})
        const accessToken = sign({username:phoneNumber},ACCESS_KEY,60*5)
        const refreshToken = sign({username:phoneNumber},REFRESH_KEY)
        const updateVerify = await User.updateOne({username:phoneNumber},{verify:true,token:{$push:refreshToken}})

        if(updateVerify.acknowledged && updateVerify.modifiedCount>0 )
            return res.status(200).json({
                success:true,
                message:"Phone number verified successfully",
                data:{
                    token:accessToken,
                    refreshToken:refreshToken
                }
            })
        return res.status(400).json({success:false, message:"there is not any user updated successfully"})
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {verifyEmail,verifyPhoneNumber}

