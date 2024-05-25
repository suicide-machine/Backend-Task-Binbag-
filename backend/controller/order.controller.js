import { CatchAsyncErrors } from "../middleware/catchAsyncErrors.js"
import Order from "../model/order.model.js"
import Product from "../model/product.model.js"
import User from "../model/user.model.js"
import ErrorHandler from "../utils/ErrorHandler.js"
import sendMail from "../utils/sendEmail.js"

// Create new order
export const newOrder = CatchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  })

  res.status(201).json({
    success: true,
    order,
  })
})

// get all orders of a user
export const myOrder = CatchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })

  res.status(200).json({
    success: true,
    orders,
  })
})

// get single order
export const getSingleOrder = CatchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    )

    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404))
    }

    res.status(200).json({
      success: true,
      order,
    })
  } catch (error) {
    return next(new ErrorHandler(error, 500))
  }
})

// get all orders by admin
export const getAllOrdersByAdmin = CatchAsyncErrors(async (req, res, next) => {
  try {
    const orders = await Order.find()

    let totalAmount = 0

    orders.forEach((order) => {
      totalAmount += order.totalPrice
    })

    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    })
  } catch (error) {
    return next(new ErrorHandler(error, 500))
  }
})

// Update order status by admin
export const updateOrderByAdmin = CatchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    const userId = order.user
    const user = await User.findById(userId)

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400))
    }

    order.orderStatus = req.body.orderStatus

    if (req.body.orderStatus.trackingStatus === "in transit") {
      order.orderItems.forEach(async (o) => {
        await updateOrder(o.product, o.quantity)
      })

      order.inTransitAt = Date.now()

      const timeStamp = new Date(order.inTransitAt)

      const orderCurrentLocation = order.orderStatus.location

      // console.log(orderCurrentLocation)

      // Options for formatting the date and time
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }

      const formattedDate = timeStamp.toLocaleString("en-US", options)

      const message = `Your product has been ${req.body.orderStatus.trackingStatus} at ${formattedDate} and current location is ${orderCurrentLocation}`

      await sendMail({
        email: user.email,
        subject: "Product status change",
        message,
      })
    }

    if (req.body.orderStatus.trackingStatus === "delivered") {
      order.deliveredAt = Date.now()
      order.paymentInfo.status = "Succeeded"

      const timeStamp = new Date(order.deliveredAt)
      const orderCurrentLocation = order.orderStatus.location

      // Options for formatting the date and time
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }

      const formattedDate = timeStamp.toLocaleString("en-US", options)

      const message = `Your product has been ${req.body.orderStatus.trackingStatus} at ${formattedDate} and current location is ${orderCurrentLocation}`

      await sendMail({
        email: user.email,
        subject: "Product status change",
        message,
      })
    }

    await order.save({ validateBeforeSave: false })

    res.status(200).json({
      success: true,
      order,
    })

    // Update the stock and sold_out fields for a product based on the quantity ordered.

    async function updateOrder(id, qty) {
      const product = await Product.findById(id)

      product.stock -= qty
      product.sold_out += qty

      await product.save({ validateBeforeSave: false })
    }
  } catch (error) {
    return next(new ErrorHandler(error, 500))
  }
})

// delete an existing product by admin
export const deleteOrderByAdmin = CatchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404))
    }

    await Order.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Order has been deleted",
    })
  } catch (error) {
    return next(new ErrorHandler(error, 500))
  }
})
