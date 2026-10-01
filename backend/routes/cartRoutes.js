const express = require('express')
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controller/cartController')
const { protect, authorize } = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/getCart', protect, authorize("cashier"), getCart)
router.post('/addToCart', protect, authorize("cashier"), addToCart)
router.patch('/updateCartItem/:productId', protect, authorize("cashier"), updateCartItem)
router.delete('/removeCartItem/:productId', protect, authorize("cashier"), removeCartItem)
router.delete('/clearCart', protect, authorize("cashier"), clearCart)

module.exports = router