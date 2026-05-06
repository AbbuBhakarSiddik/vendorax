const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const http = require('http')
const { Server } = require('socket.io')

dotenv.config()
connectDB()

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

// Make io accessible in controllers
app.set('io', io)

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes (we'll uncomment as we build each one)
app.use('/api/v1/auth', require('./routes/authRoutes'))
app.use('/api/v1/stores', require('./routes/storeRoutes'))
app.use('/api/v1/products', require('./routes/productRoutes'))
app.use('/api/v1/orders', require('./routes/orderRoutes'))
app.use('/api/v1/ai', require('./routes/aiRoutes'))
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'))
app.use('/api/v1/admin', require('./routes/adminRoutes'))


// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Join personal room
  socket.on('join', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined their room`)
  })

  // Join seller room
  socket.on('joinSeller', (sellerId) => {
    socket.join(`seller_${sellerId}`)
    console.log(`Seller ${sellerId} joined seller room`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})


app.get('/', (req, res) => {
  res.json({ message: 'VendoraX API is running' })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
