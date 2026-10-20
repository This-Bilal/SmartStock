const { createHash, randomBytes } = require("node:crypto");
const bcrypt = require("bcrypt");
const Owner = require("../models/ownerModel");
const Employee = require("../models/employeeModel");
const { sendEmail } = require("./emailService");

const TOKEN_EXPIRY_MS = 20 * 60 * 1000;
const PASSWORD_MAX_LENGTH = 72;
const TOKEN_PATTERN = /^[a-f0-9]{64}$/i;

const createPasswordResetService = ({
  OwnerModel = Owner,
  EmployeeModel = Employee,
  send = sendEmail,
  environment = process.env,
  now = () => new Date(),
  logger = console,
} = {}) => {
  const requestPasswordReset = async (email, accountType) => {
    const Model = accountType === "owner" ? OwnerModel : EmployeeModel;
    const user = await Model.findOne({ email });

    if (!user) {
      const OtherModel =
        accountType === "owner" ? EmployeeModel : OwnerModel;
      const otherAccount = await OtherModel.findOne({ email });

      return otherAccount
        ? {
            status: "wrong_account_type",
            actualAccountType: accountType === "owner" ? "employee" : "owner",
          }
        : false;
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(now().getTime() + TOKEN_EXPIRY_MS);
    const updatedUser = await Model.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          passwordResetToken: tokenHash,
          passwordResetExpiresAt: expiresAt,
        },
      },
      { returnDocument: "after" },
    );

    if (!updatedUser) {
      return false;
    }

    try {
      const resetUrl = getResetUrl(environment.FRONTEND_URL);
      resetUrl.searchParams.set("token", token);

      await send({
        to: user.email,
        subject: "Reset Your SmartStock Password",
        text: `Hello ${user.name},\n\nWe received a request to reset your SmartStock password. Reset it using this link:\n${resetUrl.toString()}\n\nThis link expires in 20 minutes. If you did not request a password reset, you can ignore this email.`,
        html: `<div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;"><h1 style="color: #dc2626;">Reset your SmartStock password</h1><p>Hello ${escapeHtml(user.name)},</p><p>We received a request to reset your SmartStock password. Use the button below to choose a new password.</p><p style="margin: 28px 0;"><a href="${escapeHtml(resetUrl.toString())}" style="background-color: #ef4444; border-radius: 8px; color: #ffffff; display: inline-block; padding: 12px 20px; text-decoration: none;">Reset password</a></p><p>This link expires in 20 minutes.</p><p>If you did not request a password reset, you can ignore this email. Your password will not change.</p></div>`,
      });
    } catch {
      logger.error("[password-reset] Reset email could not be sent.");
      await Model.updateOne(
        { _id: user._id, passwordResetToken: tokenHash },
        {
          $unset: {
            passwordResetToken: "",
            passwordResetExpiresAt: "",
          },
        },
      );
      return false;
    }

    return true;
  };

  const resetPassword = async (token, password) => {
    if (!TOKEN_PATTERN.test(token)) {
      return false;
    }

    if (!isValidPassword(password)) {
      return false;
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const conditions = {
      passwordResetToken: tokenHash,
      passwordResetExpiresAt: { $gt: now() },
    };
    const update = {
      $set: { password: hashedPassword },
      $unset: {
        passwordResetToken: "",
        passwordResetExpiresAt: "",
      },
    };

    const owner = await OwnerModel.findOneAndUpdate(conditions, update, {
      returnDocument: "after",
    });
    if (owner) {
      return true;
    }

    const employee = await EmployeeModel.findOneAndUpdate(
      conditions,
      update,
      { returnDocument: "after" },
    );
    return Boolean(employee);
  };

  return { requestPasswordReset, resetPassword };
};

const getResetUrl = (frontendUrl) => {
  if (typeof frontendUrl !== "string" || !frontendUrl.trim()) {
    throw new Error("FRONTEND_URL must be configured to send password resets.");
  }

  const baseUrl = new URL(frontendUrl);
  if (
    !["http:", "https:"].includes(baseUrl.protocol) ||
    baseUrl.username ||
    baseUrl.password
  ) {
    throw new Error("FRONTEND_URL must be a valid HTTP(S) URL.");
  }

  return new URL("/reset-password", baseUrl);
};

const isValidPassword = (password) =>
  typeof password === "string" &&
  Array.from(password).length >= 8 &&
  Array.from(password).length <= PASSWORD_MAX_LENGTH &&
  Buffer.byteLength(password, "utf8") <= PASSWORD_MAX_LENGTH;

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

module.exports = {
  createPasswordResetService,
  isValidPassword,
  PASSWORD_MAX_LENGTH,
  TOKEN_EXPIRY_MS,
};
