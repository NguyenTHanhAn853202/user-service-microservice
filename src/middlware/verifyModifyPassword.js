const Joi = require('joi');

const schema = Joi.object({
    username: [Joi.string().required().pattern(new RegExp(/^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/)),Joi.string().required().pattern(new RegExp(/^(?:[0-9] ?){9,14}[0-9]$/))],
    password: Joi.string().required().min(7).pattern(new RegExp(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]).{8,}$/)),
    newPassword: Joi.string().required().min(7).pattern(new RegExp(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]).{8,}$/)),
    repeatPassword:Joi.ref("newPassword")
})

const verifyModifyPassword = async(req,res,next) => {
    try {
        const {password,newPassword,repeatPassword} = req.body
        const {error,value} = schema.validate({password: password,newPassword:newPassword,repeatPassword:repeatPassword})
        if(error) return res.status(400).json({
            success:false,
            message:"Invalid username or password",
            error:error 
        })
        if(password === newPassword) return res.status(401).json({
            success:false,
            message:"The new password cannot be the same as the old password"
        })
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = verifyModifyPassword