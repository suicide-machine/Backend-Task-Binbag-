import express from "express"
import { isAdmin, isAuthenticated } from "../middleware/auth.js"
import {
  deleteOrderByAdmin,
  getAllOrdersByAdmin,
  getSingleOrder,
  myOrder,
  newOrder,
  updateOrderByAdmin,
} from "../controller/order.controller.js"

const router = express.Router()

// Order routes for user
router.post("/new", isAuthenticated, newOrder)
router.get("/my-order", isAuthenticated, myOrder)
router.get("/:id", isAuthenticated, getSingleOrder)

// Order routes for admin
router.get(
  "/admin/orders",
  isAuthenticated,
  isAdmin("Admin"),
  getAllOrdersByAdmin
)

router.put(
  "/admin/order/:id",
  isAuthenticated,
  isAdmin("Admin"),
  updateOrderByAdmin
)

router.delete(
  "/admin/order/:id",
  isAuthenticated,
  isAdmin("Admin"),
  deleteOrderByAdmin
)

export default router
