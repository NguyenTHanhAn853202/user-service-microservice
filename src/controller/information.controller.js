const User = require("../model/user")

const information = async(req,res,next) => {
    try {
        const {username = ""} = req.user
        const {address='',phoneNumber='',email='',gender='',avatar=''} = req.body
        const userFound = await User.exists({username: username})
        if(!userFound) return res.status(401).json({
            success:false,
            message:"User not found"
        })
        const userUpdated = await User.updateOne({username:username},{address:address,phoneNumber:phoneNumber,email:email,gender:gender,avatar:avatar})
        if(userUpdated.modifiedCount > 0 && userUpdated.acknowledged) 
            return res.status(200).json({
                success:true,
                message:"User information updated successfully"
            })
        return res.status(200).json({success:false, message:"there is any user updated successfully"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    
}
module.exports = information
