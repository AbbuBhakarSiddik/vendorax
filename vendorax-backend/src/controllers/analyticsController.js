const Order = require('../models/Order')
const Product = require('../models/Product')
const Store = require('../models/Store')

exports.getStoreAnalytics = async (req, res) => {
  try {
    const store = await Store.findOne({ sellerId: req.user._id })
    if (!store) {
      return res.status(404).json({ message: 'No store found' })
    }

    const orders = await Order.find({ storeId: store._id })

    // Total stats
    const totalOrders = orders.length
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0)

    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length
    const confirmedOrders = orders.filter(o => o.orderStatus === 'confirmed').length
    const shippedOrders = orders.filter(o => o.orderStatus === 'shipped').length
    const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length
    const cancelledOrders = orders.filter(o => o.orderStatus === 'cancelled').length

    // Revenue last 7 days
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short'
      })
      const dayRevenue = orders
        .filter(o => {
          const orderDate = new Date(o.createdAt)
          return orderDate.toDateString() === date.toDateString()
            && o.paymentStatus === 'paid'
        })
        .reduce((sum, o) => sum + o.totalAmount, 0)

      last7Days.push({ date: dateStr, revenue: dayRevenue })
    }

    // Top selling products
    const productSales = {}
    orders.forEach(order => {
      order.products.forEach(p => {
        if (!productSales[p.name]) {
          productSales[p.name] = { name: p.name, qty: 0, revenue: 0 }
        }
        productSales[p.name].qty += p.qty
        productSales[p.name].revenue += p.price * p.qty
      })
    })
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)

    // Total products
    const totalProducts = await Product.countDocuments({ storeId: store._id })

    res.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      orderStatus: {
        pending: pendingOrders,
        confirmed: confirmedOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },
      last7Days,
      topProducts
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}