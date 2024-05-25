import User from "../model/user.model.js"
import ErrorHandler from "../utils/ErrorHandler.js"
import { CatchAsyncErrors } from "./catchAsyncErrors.js"
import jwt from "jsonwebtoken"

export const isAuthenticated = CatchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401))
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

  req.user = await User.findById(decoded.id)

  next()
})

export const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} can not access this resources!`)
      )
    }
    next()
  }
}
