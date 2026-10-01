const express = require('express')
const { addStock, updateStock, getInventoryHistory, removeStock } = require('../controller/inventoryController')
const { protect, authorize } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/addStock/:productId', protect, authorize("manager"), addStock)
router.patch('/removeStock/:productId', protect, authorize("manager"), removeStock)
router.patch('/updateStock/:productId', protect, authorize("manager"), updateStock)
router.get('/getInventoryHistory', protect, authorize("manager", "owner"), getInventoryHistory)

module.exports = router