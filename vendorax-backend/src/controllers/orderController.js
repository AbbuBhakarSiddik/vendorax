const Order = require('../models/Order')
const Product = require('../models/Product')
const { createRazorpayOrder, verifyPaymentSignature } = require('../services/paymentService')

// ─── Existing endpoints (unchanged) ──────────────────────────────────────────

exports.getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .populate('storeId', 'storeName storeSlug')
      .sort({ createdAt: -1 })
    res.json({ orders })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getStoreOrders = async (req, res) => {
  try {
    const orders = await Order.find({ storeId: req.params.storeId })
      .populate('buyerId', 'name email')
      .sort({ createdAt: -1 })
    res.json({ orders })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ message: 'Order status updated', order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('storeId', 'storeName storeSlug')
      .populate('buyerId', 'name email')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, buyerId: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found' })

    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel an order that has been shipped or delivered' })
    }

    order.orderStatus = 'cancelled'
    await order.save()

    // Restore stock for each product
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.qty } })
    }

    res.json({ message: 'Order cancelled successfully', order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─── NEW: Razorpay payment flow ───────────────────────────────────────────────

/**
 * POST /api/v1/orders/payment/initiate
 * Validates stock, creates a Razorpay order, returns key + order details.
 * Does NOT create a DB order yet — that happens after payment verification.
 */
exports.initiatePayment = async (req, res) => {
  try {
    const { storeId, products, totalAmount, shippingAddress } = req.body

    // Validate stock for every product
    for (const item of products) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` })
      }
      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`
        })
      }
    }

    // Create Razorpay order
    // Razorpay receipt max length is 40 chars
    const uid = req.user._id.toString().slice(-8)
    const receipt = `rcpt_${uid}_${Date.now()}`  // ~27 chars, well under 40
    const rzpOrder = await createRazorpayOrder(totalAmount, receipt)

    res.json({
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,       // in paise
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      // Pass back the cart data so frontend can send it in verify step
      orderData: { storeId, products, totalAmount, shippingAddress }
    })
  } catch (error) {
    console.error('Payment initiation error:', error)
    res.status(500).json({ message: error.message || 'Payment initiation failed' })
  }
}

/**
 * POST /api/v1/orders/payment/verify
 * Verifies Razorpay signature, creates DB order, decrements stock.
 */
exports.verifyAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData // { storeId, products, totalAmount, shippingAddress }
    } = req.body

    // 1. Verify signature
    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    if (!isValid) {
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' })
    }

    // 2. Create order in DB
    const order = await Order.create({
      buyerId: req.user._id,
      storeId: orderData.storeId,
      products: orderData.products,
      totalAmount: orderData.totalAmount,
      paymentStatus: 'paid',
      paymentGateway: 'razorpay',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      shippingAddress: orderData.shippingAddress
    })

    // 3. Decrement stock for each product
    for (const item of orderData.products) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } })
    }

    res.status(201).json({ message: 'Payment verified. Order placed successfully.', order })
  } catch (error) {
    console.error('Payment verification error:', error)
    res.status(500).json({ message: error.message || 'Payment verification failed' })
  }
}
