import app from "./app.js"
import dotenv from "dotenv"
import connectDatabase from "./db/database.js"

dotenv.config({
  path: "config/.env",
})

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`)
  console.log(`Shutting down the server for handling uncaught exception`)
})

// connect db
connectDatabase()

// create server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`)
})

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`)
  console.log(`Shutting down the server for unhandled promise rejection`)

  server.close(() => {
    process.exit(1)
  })
})
