
const Public = require("./public.routes")
const Secure = require("./secure.routes")




const router = (app)=>{
   app.use("/api/v1/user/public",Public)
   app.use("/api/v1/user/secure",Secure)
}

module.exports = router;