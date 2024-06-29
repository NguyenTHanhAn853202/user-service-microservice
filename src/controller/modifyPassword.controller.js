const User = require("../model/user")

const modifyPassword = async(req,res)=>{
    try {
        const {password='',newPassword} = req.body
        const {username=''} =req.user
        const userFound = await User.findOne({username: username})
        if(!userFound) return res.status(401).json({message:"User not found"})
        const comparePassword = await User.comparePassword(password, userFound.password)
        if(!comparePassword) return res.status(401).json({message:"Password mismatch"})
        userFound.password = newPassword
        await userFound.save()
        return res.status(200).json({message: "Password updated successfully"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = modifyPassword