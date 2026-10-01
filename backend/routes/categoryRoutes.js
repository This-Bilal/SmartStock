const express = require('express')
const { createCategory, getCategories, getCategory, updateCategory, toggleCategoryStatus } = require('../controller/categoryController')
const { protect, authorize } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/createCategory', protect, authorize("manager"), createCategory)
router.get('/getAllCategories', protect, authorize("manager"), getCategories)
router.get('/getAcategory/:id', protect, authorize("manager"), getCategory)
router.patch('/updateCategory/:id', protect, authorize("manager"), updateCategory)
router.patch('/toggleCategoryStatus/:id', protect, authorize("manager"), toggleCategoryStatus)

module.exports = router