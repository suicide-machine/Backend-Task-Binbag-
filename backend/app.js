import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from "cors"
import { customError } from "./middleware/error.js"

// import routes
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import productRouter from "./routes/product.route.js"
import orderRouter from "./routes/order.route.js"

dotenv.config({
  path: "backend/config/.env",
})

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use("/", express.static("uploads"))
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/order", orderRouter)

// it's for ErrorHandling
app.use(customError)

export default app
