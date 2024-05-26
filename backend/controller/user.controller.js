import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js"
import User from "../model/user.model.js"
import ErrorHandler from "../utils/ErrorHandler.js"
import bcryptjs from "bcryptjs"

// Update user profile
export const updateUserInfo = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return next(new ErrorHandler("User not found", 400))
    }

    const isPasswordValid = bcryptjs.compareSync(password, user.password)

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      )
    }

    user.name = name
    user.email = email
    user.phoneNumber = phoneNumber

    await user.save()

    // excluding the password when sending user data in a response.
    const { password: pass, ...rest } = user._doc

    res.status(200).json({
      success: true,
      rest,
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 500))
  }
})

// delete user profile (can be done by user)
export const deleteUser = CatchAsyncErrors(async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(
        new ErrorHandler("You can only delete your own account!", 400)
      )

    await User.findByIdAndDelete(req.params.id)

    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        message: "User has been deleted!",
      })
  } catch (error) {
    return next(new ErrorHandler(error.message, 500))
  }
})

// Get User Detail
export const getUserInfo = CatchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    res.status(201).json({
      success: true,
      user,
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 500))
  }
})

// all users --- for admin
export const getAllUser = CatchAsyncErrors(async (req, res, next) => {
  try {
    const users = await User.find().sort({
      createdAt: -1,
    })

    res.status(201).json({
      success: true,
      users,
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 500))
  }
})

// delete user by admin
export const deleteUserByAdmin = CatchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return next(new ErrorHandler("User is not available with this id", 400))
    }

    await User.findByIdAndDelete(req.params.id)

    res.status(201).json({
      success: true,
      message: "User deleted successfully!",
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 500))
  }
})
