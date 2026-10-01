const express = require("express");
const {
  getCurrentSubscription,
  checkSubscriptionFeature,
  cancelCurrentSubscription
} = require("../controller/subscriptionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCurrentSubscription);
router.get("/check/:feature", protect, checkSubscriptionFeature);
router.patch("/cancel", protect, cancelCurrentSubscription);

module.exports = router;
