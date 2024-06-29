const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const connectDB = require("./database")
const router = require("./router/index.routes")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")



// const {app,server} = require("./socket")
require("dotenv").config()

const mongodbURL = process.env.MONGODB_URL
const port = process.env.PORT || 3002

const app = express()

app.use(morgan())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials: true,
    }
))

connectDB(mongodbURL)
router(app)

app.listen(port,()=>{
    console.log("listening to port test: " + port)
})