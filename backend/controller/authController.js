const asyncHandler = require('express-async-handler')
const {
  createPasswordResetService,
  isValidPassword,
} = require("../services/passwordResetService");

const passwordResetService = createPasswordResetService();
const PASSWORD_RESET_MESSAGE =
  "If an account matches those details, a password reset link will be sent.";

const checkLoginStatus = asyncHandler(async (req, res) => {
  res.status(200).json(true);
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email, accountType } = req.body || {};
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  if (!["owner", "employee"].includes(accountType)) {
    return res
      .status(400)
      .json({ message: "Please select a valid account type." });
  }

  try {
    const result = await passwordResetService.requestPasswordReset(
      normalizedEmail,
      accountType,
    );

    if (result?.status === "wrong_account_type") {
      const accountLabel =
        result.actualAccountType === "owner" ? "Owner" : "Employee";
      return res.status(400).json({
        message: `This email belongs to an ${accountLabel} account. Select ${accountLabel} and try again.`,
      });
    }

    return res.status(200).json({ message: PASSWORD_RESET_MESSAGE });
  } catch (error) {
    console.error(
      `[password-reset] Request could not be processed (${getSafeErrorName(error)}).`,
    );
    return res.status(500).json({
      message: "Unable to process your request right now. Please try again later.",
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body || {};

  if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
    return res.status(400).json({
      message: "This password reset link is invalid or has expired.",
    });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and no more than 72 bytes.",
    });
  }

  try {
    const didReset = await passwordResetService.resetPassword(token, password);
    if (!didReset) {
      return res.status(400).json({
        message: "This password reset link is invalid or has expired.",
      });
    }

    return res.status(200).json({
      message: "Your password has been reset. Please log in with your new password.",
    });
  } catch (error) {
    console.error(
      `[password-reset] Password could not be updated (${getSafeErrorName(error)}).`,
    );
    return res.status(500).json({
      message: "Unable to reset your password right now. Please try again later.",
    });
  }
});

const getSafeErrorName = (error) =>
  error instanceof Error ? error.name : "UnknownError";

module.exports = {
  checkLoginStatus,
  requestPasswordReset,
  resetPassword,
}