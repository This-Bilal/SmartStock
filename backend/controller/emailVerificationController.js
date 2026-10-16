const asyncHandler = require("express-async-handler");
const Employee = require("../models/employeeModel");
const Owner = require("../models/ownerModel");
const {
  hashVerificationToken,
  issueEmailVerification,
} = require("../services/emailVerificationService");

const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.body?.token;

  if (!token || typeof token !== "string") {
    return res.status(400).json({
      message: "A verification token is required.",
    });
  }

  const tokenHash = hashVerificationToken(token);
  const verificationQuery = {
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpires: { $gt: new Date() },
    isEmailVerified: false,
  };
  const selection = "+emailVerificationTokenHash +emailVerificationExpires";

  const [owner, employee] = await Promise.all([
    Owner.findOne(verificationQuery).select(selection),
    Employee.findOne(verificationQuery).select(selection),
  ]);
  const account = owner || employee;

  if (!account) {
    return res.status(400).json({
      message: "This verification link is invalid or has expired.",
    });
  }

  account.isEmailVerified = true;
  account.emailVerificationTokenHash = undefined;
  account.emailVerificationExpires = undefined;
  await account.save();

  return res.status(200).json({
    message: "Your email address has been verified. You can now log in.",
  });
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const email = req.body?.email;

  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      message: "A valid email address is required.",
    });
  }

  const normalisedEmail = email.trim().toLowerCase();
  const unverifiedAccounts = await Promise.all([
    Owner.find({ email: normalisedEmail, isEmailVerified: false }),
    Employee.find({ email: normalisedEmail, isEmailVerified: false }),
  ]);

  for (const account of unverifiedAccounts.flat()) {
    await issueEmailVerification(account);
  }

  return res.status(200).json({
    message:
      "If an unverified account exists for this email, a new verification link has been sent.",
  });
});

module.exports = {
  resendVerificationEmail,
  verifyEmail,
};
