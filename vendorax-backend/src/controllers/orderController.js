const Order = require('../models/Order')

exports.createOrder = async (req, res) => {
  try {
    const { storeId, products, totalAmount, paymentStatus, paymentGateway, shippingAddress } = req.body

    const order = await Order.create({
      buyerId: req.user._id,
      storeId,
      products,
      totalAmount,
      paymentStatus,
      paymentGateway,
      shippingAddress
    })

    res.status(201).json({ message: 'Order placed successfully', order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

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
    const order = await Order.findOne({
      _id: req.params.id,
      buyerId: req.user._id
    })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({
        message: 'Cannot cancel order that has been shipped or delivered'
      })
    }

    order.orderStatus = 'cancelled'
    await order.save()

    res.json({ message: 'Order cancelled successfully', order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}