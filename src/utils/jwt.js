const jwt = require('jsonwebtoken');

const sign = (data,secretKey,expire=null)=>{
    return expire?jwt.sign(data,secretKey,{expiresIn:expire}):jwt.sign(data,secretKey)
}

const verify = (token,secretKey)=>{
    try{
        return jwt.verify(token,secretKey)
    }
    catch(error){
        return false
    }
}

module.exports = {
    sign,
    verify
}