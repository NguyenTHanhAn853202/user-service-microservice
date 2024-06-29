
const User = require('../model/user');

const logout = async(req, res, next) => {
    try {
        const {username=''} = req.user
        const refresh_token = req.cookies.refresh_token
        console.log(refresh_token);
        const userFound = await User.findOne({username: username})
        if(!userFound) return res.status(401).json({
            success:false,
            message:"User not found"
        })
        res.clearCookie("token")
        res.clearCookie("refresh_token")
        const userToken = userFound.token
        userFound.token = userToken.filter(t => t !== refresh_token)
        userFound.save()

        return res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

module.exports = logout;