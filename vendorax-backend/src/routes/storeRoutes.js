const express = require('express')
const router = express.Router()
const { createStore, getMyStore, updateStore, getStoreBySlug, getFeaturedStores, getAllStores } = require('../controllers/storeController')
const { protect } = require('../middleware/authMiddleware')
const { checkRole } = require('../middleware/roleMiddleware')


router.get('/featured', getFeaturedStores)
router.get('/', getAllStores)

router.post('/', protect, checkRole('seller'), createStore)
router.get('/my', protect, checkRole('seller'), getMyStore)
router.put('/my', protect, checkRole('seller'), updateStore)
router.get('/:slug', getStoreBySlug)

module.exports = router