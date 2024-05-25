import express from "express"
import { isAdmin, isAuthenticated } from "../middleware/auth.js"
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getAllProductsByAdmin,
  updateProduct,
} from "../controller/product.controller.js"

const router = express.Router()

router.post("/create-product", isAuthenticated, isAdmin("Admin"), createProduct)

router.get("/get-all-products", getAllProducts)

router.post(
  "/update-product/:id",
  isAuthenticated,
  isAdmin("Admin"),
  updateProduct
)

router.delete(
  "/delete-product/:id",
  isAuthenticated,
  isAdmin("Admin"),
  deleteProduct
)

router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  getAllProductsByAdmin
)

export default router
