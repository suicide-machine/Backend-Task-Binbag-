import mongoose from "mongoose"

const connectDatabase = () => {
  mongoose.connect(process.env.MONGO).then((data) => {
    console.log(`database connected with server: ${data.connection.host}`)
  })
}

export default connectDatabase
