const Joi = require('joi');

const schema = Joi.object({
    username: [Joi.string().required().pattern(new RegExp(/^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/)),Joi.string().required().pattern(new RegExp(/^(?:[0-9] ?){9,14}[0-9]$/))],
    password: Joi.string().required().min(7).pattern(new RegExp(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]).{8,}$/))
})

const login = async(req,res,next)=>{
    try {
        const {username,password} = req.body
        const {error,value} = schema.validate({username: username,password:  password})
        if(error) return res.status(400).json({message: "The username and password is incorrect"})
        next()
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = login