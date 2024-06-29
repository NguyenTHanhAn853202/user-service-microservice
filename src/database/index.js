const mongoose = require("mongoose")


const connectDB = async(mongodbURL)=>{
    try {
        
        await mongoose.connect(mongodbURL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("connectDB success")
    } catch (error) {
        console.log("connectDB error: " + error)
    }
}

module.exports = connectDB