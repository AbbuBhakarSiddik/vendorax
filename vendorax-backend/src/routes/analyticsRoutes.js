const express = require('express')
const router = express.Router()
const { getStoreAnalytics } = require('../controllers/analyticsController')
const { protect } = require('../middleware/authMiddleware')
const { checkRole } = require('../middleware/roleMiddleware')

router.get('/store', protect, checkRole('seller'), getStoreAnalytics)

module.exports = router