const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Rate limiting ────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter for login/register
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many auth attempts, please try again in 15 minutes.' }
})

app.use(globalLimiter)

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authLimiter, require('./routes/authRoutes'))
app.use('/api/v1/stores', require('./routes/storeRoutes'))
app.use('/api/v1/products', require('./routes/productRoutes'))
app.use('/api/v1/orders', require('./routes/orderRoutes'))
app.use('/api/v1/ai', require('./routes/aiRoutes'))
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'))
app.use('/api/v1/admin', require('./routes/adminRoutes'))

app.get('/', (req, res) => {
  res.json({ message: 'VendoraX API is running' })
})

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong'
    : err.message
  res.status(status).json({ message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
