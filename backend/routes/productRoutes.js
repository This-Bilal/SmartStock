const express = require('express')
const { createProduct, getProducts, getCashierProducts, getProduct, updateProduct, toggleProductStatus, getLowStockProducts, outOfStockProducts } = require('../controller/productController')
const { protect, authorize } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const router = express.Router()

router.post('/createProduct', protect, authorize("manager"), upload.single("image"), createProduct)
router.get('/getAllProducts', protect, authorize("owner", "manager"), getProducts)
router.get('/getCashierProducts', protect, authorize("cashier"), getCashierProducts)
router.get('/getSingleProduct/:id', protect, authorize("owner", "manager"), getProduct)
router.patch('/updateProduct/:id', protect, authorize("manager"), upload.single("image"), updateProduct)
router.patch('/toggleProductStatus/:id', protect, authorize("manager"), toggleProductStatus)
router.get('/lowStock', protect, authorize("owner", "manager"), getLowStockProducts)
router.get('/outOfStock', protect, authorize("owner", "manager"), outOfStockProducts)

module.exports = router