const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const {
  checkLoginStatus,
  requestPasswordReset,
  resetPassword,
} = require("../controller/authController")
const router = express.Router()

router.get("/status", protect, checkLoginStatus)
router.post("/forgot-password", requestPasswordReset)
router.post("/reset-password", resetPassword)

module.exports = router