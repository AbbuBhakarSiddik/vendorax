const express = require('express')
const router = express.Router()
const { getDescription, getTags, getPricingSuggestion } = require('../controllers/aiController')
const { protect } = require('../middleware/authMiddleware')
const { checkRole } = require('../middleware/roleMiddleware')

router.post('/description', protect, checkRole('seller'), getDescription)
router.post('/tags', protect, checkRole('seller'), getTags)
router.post('/pricing', protect, checkRole('seller'), getPricingSuggestion)

module.exports = router