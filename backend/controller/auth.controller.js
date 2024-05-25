import User from "../model/user.model.js"
import ErrorHandler from "../utils/ErrorHandler.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js"

export const signup = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const userEmail = await User.findOne({ email })

    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({ name, email, password: hashedPassword })

    try {
      await newUser.save()

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY)

      const { password: pass, ...rest } = newUser._doc

      res.cookie("token", token, { httpOnly: true }).status(201).json(rest)
    } catch (error) {
      return next(new ErrorHandler(error.message, 500))
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400))
  }
})

export const signin = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(new ErrorHandler("Please provide the all fields!", 400))
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return next(new ErrorHandler("User doesn't exists!", 400))
    }

    const isPasswordValid = bcryptjs.compareSync(password, user.password)

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      )
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY)

    const { password: pass, ...rest } = user._doc

    res.cookie("token", token, { httpOnly: true }).status(200).json(rest)
  } catch (error) {
    return next(new ErrorHandler(error.message, 400))
  }
})

export const signOut = CatchAsyncErrors(async (req, res, next) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        message: "Log out successful!",
      })
  } catch (error) {
    return next(new ErrorHandler(error.message, 400))
  }
})
