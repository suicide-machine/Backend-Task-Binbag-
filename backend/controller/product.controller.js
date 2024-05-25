import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js"
import Product from "../model/product.model.js"
import ErrorHandler from "../utils/ErrorHandler.js"

// Create a new product
export const createProduct = CatchAsyncErrors(async (req, res, next) => {
  try {
    const productData = req.body

    const product = await Product.create(productData)

    res.status(201).json({
      success: true,
      product,
    })
  } catch (error) {
    return next(new ErrorHandler(error, 500))
  }
})

// Get All Products
export const getAllProducts = CatchAsyncErrors(async (req, res, next) => {
  try {
    const products = await Product.find()

    res.status(200).json({
      success: true,
      products,
    })
  } catch (error) {
    return next(new ErrorHandler(error, 500))
  }
})

// Update product information(name, original price, discount price etc)
export const updateProduct = CatchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return next(new ErrorHandler("Product not found!", 404))
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.status(200).json({
      success: true,
      updatedProduct,
    })
  } catch (error) {
    return next(new ErrorHandler(error, 500))
  }
})

// delete an existing product
export const deleteProduct = CatchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return next(new ErrorHandler("Product not found!", 404))
    }

    await Product.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Product has been deleted",
    })
  } catch (error) {
    return next(new ErrorHandler(error, 500))
  }
})

// get all products by admin
export const getAllProductsByAdmin = CatchAsyncErrors(
  async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      })

      res.status(200).json({
        success: true,
        products,
      })
    } catch (error) {
      return next(new ErrorHandler(error, 500))
    }
  }
)
