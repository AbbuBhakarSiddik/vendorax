const express = require('express')
const router = express.Router()
const {
  createOrder, getBuyerOrders, getStoreOrders,
  updateOrderStatus, getSingleOrder, cancelOrder
} = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')
const { checkRole } = require('../middleware/roleMiddleware')

router.put('/:id/cancel', protect, checkRole('buyer'), cancelOrder)
router.post('/', protect, checkRole('buyer'), createOrder)
router.get('/buyer', protect, checkRole('buyer'), getBuyerOrders)
router.get('/store/:storeId', protect, checkRole('seller'), getStoreOrders)
router.put('/:id/status', protect, updateOrderStatus)
router.get('/:id', protect, getSingleOrder)

module.exports = router