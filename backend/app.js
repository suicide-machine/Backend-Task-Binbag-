import express from "express"
import dotenv from "dotenv"
import ErrorHandler from "./utils/ErrorHandler.js"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import fileUpload from "express-fileupload"

dotenv.config({
  path: "backend/config/.env",
})

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload({ useTempFiles: true }))

export default app
