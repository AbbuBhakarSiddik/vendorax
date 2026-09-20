const express = require('express')
const router = express.Router()
const { register, login, refreshToken, getProfile, updateProfile } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const validateRequest = require('../middleware/validateRequest')
const { registerSchema, loginSchema } = require('../validators/authValidator')

router.post('/register', validateRequest(registerSchema), register)
router.post('/login', validateRequest(loginSchema), login)
router.post('/refresh', refreshToken)
router.get('/me', protect, getProfile)
router.put('/profile', protect, updateProfile)

module.exports = router
