import express from "express"
import { isAdmin, isAuthenticated } from "../middleware/auth.js"
import {
  deleteUser,
  deleteUserByAdmin,
  getAllUser,
  getUserInfo,
  updateUserInfo,
} from "../controller/user.controller.js"

const router = express.Router()

// Routes for user
router.post("/update-user-info", isAuthenticated, updateUserInfo)

router.delete("/delete/:id", isAuthenticated, deleteUser)

router.get("/user-info/:id", isAuthenticated, getUserInfo)

// routes for admin

router.get("/admin-all-users", isAuthenticated, isAdmin("Admin"), getAllUser)

router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  deleteUserByAdmin
)

export default router
