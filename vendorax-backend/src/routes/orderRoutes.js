const express = require('express')
const router = express.Router()
const {
  getBuyerOrders, getStoreOrders, updateOrderStatus,
  getSingleOrder, cancelOrder,
  initiatePayment, verifyAndCreateOrder
} = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')
const { checkRole } = require('../middleware/roleMiddleware')

// Payment routes (must come before /:id to avoid conflicts)
router.post('/payment/initiate', protect, checkRole('buyer'), initiatePayment)
router.post('/payment/verify', protect, checkRole('buyer'), verifyAndCreateOrder)

// Order routes
router.get('/buyer', protect, checkRole('buyer'), getBuyerOrders)
router.get('/store/:storeId', protect, checkRole('seller'), getStoreOrders)
router.put('/:id/status', protect, checkRole('seller'), updateOrderStatus)
router.put('/:id/cancel', protect, checkRole('buyer'), cancelOrder)
router.get('/:id', protect, getSingleOrder)

module.exports = router
