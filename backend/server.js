require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const MONGO_URI = process.env.MONGO_URI
const corsOption = require('./config/corsOption')

const cartRoutes = require('./routes/cartRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const employeeRoutes = require('./routes/employeeRoutes')
const inventoryRoutes = require('./routes/inventoryRoutes')
const ownerRoutes = require('./routes/ownerRoutes')
const productRoutes = require('./routes/productRoutes')
const reportRoutes = require('./routes/reportRoutes')
const salesRoutes = require('./routes/salesRoutes')
const authRoute = require('./routes/authRoute')
const subscriptionRoutes = require('./routes/subscriptionRoutes')
const paymentRoutes = require("./routes/paymentRoutes")

// Setting up port
const PORT = process.env.PORT || 3000
const app = express()

// So your server will capture both: req.body and req.rawBody
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use("/uploads", express.static("uploads"));
app.use(cors(corsOption))

app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

// Logging all incoming requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next()
})

// Welcome message
app.get("/", (req, res) => {
    res.send("Hello, SmartStock welcomes you.")
})

// Server health check endpoint
app.get("/health", (req, res) => {
    res.send({status: "ok", message: "Server is running"})
})

// Routes
app.use('/api/cart', cartRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/employee', employeeRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/owner', ownerRoutes)
app.use('/api/products', productRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/loginStatus', authRoute)
app.use('/api/subscription', subscriptionRoutes);
app.use("/api/payments", paymentRoutes);

// Start server and connect to database
try {
    const server = app.listen(PORT, () => {
        const address = server.address()
        console.log(`Yes we are live on port ${PORT}`)
        console.log(`Server address:`, address)
        console.log(`Server listens on http://localhost${PORT}`);

        // Database connection
        mongoose.connect(MONGO_URI)
        .then(() => console.log('Database connected successfully'))
        .catch((error) => {
            console.log(`Message connection error:`, error.message)
            console.log('Server will continue running without database connection')
        })
    })

    // Server error handling
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is already in use, please use a different port or stop the process`);
        } else {
            console.log(console.error(`Server error:`, error));
        }
    })

    // Logging sever when ready
    server.on('listening', () => {
        const address = server.address()
        console.log(`✅ Server is active and ready to accept connections from port ${address.port}`)
    })
} catch (error) {
    console.log(`Failed to start server:`, error)
    process.exit(1)
}