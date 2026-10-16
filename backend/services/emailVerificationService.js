const crypto = require("crypto");
const nodemailer = require("nodemailer");

const createVerificationToken = () => crypto.randomBytes(32).toString("hex");

const hashVerificationToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const getTransport = () => {
  const requiredSettings = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
    "FRONTEND_URL",
  ];
  const missingSettings = requiredSettings.filter(
    (setting) => !process.env[setting],
  );

  if (missingSettings.length > 0) {
    throw new Error(
      `Email verification is not configured. Set: ${missingSettings.join(", ")}.`,
    );
  }

  const port = Number(process.env.SMTP_PORT);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid port number.");
  }

  if (
    process.env.SMTP_SECURE &&
    !["true", "false"].includes(process.env.SMTP_SECURE)
  ) {
    throw new Error('SMTP_SECURE must be either "true" or "false".');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

const sendVerificationEmail = async ({ email, name, token }) => {
  const transport = getTransport();
  const verificationUrl = new URL(
    "/verify-email",
    process.env.FRONTEND_URL,
  );
  verificationUrl.searchParams.set("token", token);

  const safeName = escapeHtml(name);

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verify your SmartStock email",
    text: `Hello ${name},\n\nVerify your email address by visiting this link:\n${verificationUrl}\n\nThis link expires in 24 hours.`,
    html: `<p>Hello ${safeName},</p><p>Verify your SmartStock email address by clicking the link below. This link expires in 24 hours.</p><p><a href="${verificationUrl}">Verify email address</a></p>`,
  });
};

const issueEmailVerification = async (user) => {
  const token = createVerificationToken();
  user.emailVerificationTokenHash = hashVerificationToken(token);
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  await sendVerificationEmail({
    email: user.email,
    name: user.name,
    token,
  });
};

module.exports = {
  hashVerificationToken,
  issueEmailVerification,
};
