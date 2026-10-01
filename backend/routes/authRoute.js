const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const { checkLoginStatus } = require("../controller/authController")
const router = express.Router()

router.get("/status", protect, checkLoginStatus)

module.exports = router