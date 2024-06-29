
const Joi = require('joi');

const schema = Joi.object({
    username: [Joi.string().required().pattern(new RegExp(/^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/)),Joi.string().required().pattern(new RegExp(/^(?:[0-9] ?){9,14}[0-9]$/))],
    password: Joi.string().required().min(7).pattern(new RegExp(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]).{8,}$/)),
    repassword:Joi.ref('password')
})

const verifySignup = async(req,res,next)=>{
    try {
        const {username='',password='',repassword=''} = req.body
        const {error,value} = schema.validate({username: username,password: password,repassword:repassword})
        if(error) return res.status(400).json({
            success:false,
            message:"Invalid username or password"
        })
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = verifySignup