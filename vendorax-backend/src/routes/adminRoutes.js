const express = require('express')
const router = express.Router()
const {
    getPlatformStats, getAllUsers, getAllStores,
    toggleStoreStatus, toggleFeaturedStore,
    deleteUser, getAllOrders
} = require('../controllers/adminController')
const { protect } = require('../middleware/authMiddleware')
const { checkRole } = require('../middleware/roleMiddleware')

router.use(protect, checkRole('admin'))

router.get('/stats', getPlatformStats)
router.get('/users', getAllUsers)
router.get('/stores', getAllStores)
router.get('/orders', getAllOrders)
router.put('/stores/:id/toggle-status', toggleStoreStatus)
router.put('/stores/:id/toggle-featured', toggleFeaturedStore)
router.delete('/users/:id', deleteUser)

module.exports = router