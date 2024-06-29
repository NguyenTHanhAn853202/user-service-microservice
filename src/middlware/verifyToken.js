const { verify } = require("../utils/jwt")
const ACCESS_KEY = process.env.ACCESS_TOKEN || "abcd"

const authentication = async function(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = verify(token,ACCESS_KEY)
        if(!decoded){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }
}
module.exports = authentication