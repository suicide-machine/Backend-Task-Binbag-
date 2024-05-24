import express from "express"
import dotenv from "dotenv"

dotenv.config({
  path: "backend/config/.env",
})

const app = express()

export default app
