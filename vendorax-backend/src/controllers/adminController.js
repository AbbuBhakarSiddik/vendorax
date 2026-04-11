const User = require('../models/User')
const Store = require('../models/Store')
const Order = require('../models/Order')
const Product = require('../models/Product')

exports.getPlatformStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments()
        const totalSellers = await User.countDocuments({ role: 'seller' })
        const totalBuyers = await User.countDocuments({ role: 'buyer' })
        const totalStores = await Store.countDocuments()
        const totalProducts = await Product.countDocuments()
        const totalOrders = await Order.countDocuments()
        const totalRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ])

        const recentOrders = await Order.find()
            .populate('buyerId', 'name email')
            .populate('storeId', 'storeName')
            .sort({ createdAt: -1 })
            .limit(5)

        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5)

        res.json({
            totalUsers,
            totalSellers,
            totalBuyers,
            totalStores,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            recentOrders,
            recentUsers
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const { role, search } = req.query
        const query = {}
        if (role) query.role = role
        if (search) query.name = { $regex: search, $options: 'i' }
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
        res.json({ users })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find()
            .populate('sellerId', 'name email')
            .sort({ createdAt: -1 })
        res.json({ stores })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.toggleStoreStatus = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id)
        if (!store) return res.status(404).json({ message: 'Store not found' })
        store.isActive = !store.isActive
        await store.save()
        res.json({
            message: `Store ${store.isActive ? 'activated' : 'suspended'}`,
            store
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.toggleFeaturedStore = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id)
        if (!store) return res.status(404).json({ message: 'Store not found' })
        store.isFeatured = !store.isFeatured
        await store.save()
        res.json({
            message: `Store ${store.isFeatured ? 'featured' : 'unfeatured'}`,
            store
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: 'User not found' })
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin user' })
        }
        await user.deleteOne()
        res.json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('buyerId', 'name email')
            .populate('storeId', 'storeName storeSlug')
            .sort({ createdAt: -1 })
            .limit(50)
        res.json({ orders })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}