const express = require('express')
const { createSale, getSales, getSaleByNumber } = require('../controller/salesController')
const { protect, authorize } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/createSale', protect, authorize("cashier"), createSale)
router.get('/getSales', protect, getSales)
router.get('/getSingleSale/:saleNumber', protect, getSaleByNumber)

module.exports = router