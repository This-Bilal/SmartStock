const express = require("express");

const {
  initializeSubscriptionPayment,
  verifySubscriptionPayment,
  handlePaystackWebhook,
  getPaymentByReference
} = require("../controller/paymentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/initialize", protect, initializeSubscriptionPayment);

router.get("/verify/:reference", protect, verifySubscriptionPayment);

router.post("/webhook", handlePaystackWebhook);

router.get("/:reference", protect, getPaymentByReference)

module.exports = router;

