const express = require("express");
const {
  resendVerificationEmail,
  verifyEmail,
} = require("../controller/emailVerificationController");

const router = express.Router();

router.post("/verify", verifyEmail);
router.post("/resend", resendVerificationEmail);

module.exports = router;
