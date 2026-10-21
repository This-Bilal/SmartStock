const { createHash, randomBytes } = require("node:crypto");
const { sendEmail } = require("./emailService");

const TOKEN_EXPIRY_MS = 10 * 60 * 1000;

const createEmailVerificationService = ({
  send = sendEmail,
  environment = process.env,
  now = () => new Date(),
} = {}) => {
  const sendVerificationEmail = async (user, accountType) => {
    const verificationUrl = new URL(
      environment.EMAIL_VERIFICATION_URL ||
        "https://smart-stock-beta.vercel.app/verify-email",
    );
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(now().getTime() + TOKEN_EXPIRY_MS);

    verificationUrl.searchParams.set("token", token);
    verificationUrl.searchParams.set("type", accountType);

    user.isEmailVerified = false;
    user.emailVerificationToken = tokenHash;
    user.emailVerificationExpiresAt = expiresAt;
    await user.save();

    await send({
      to: user.email,
      subject: "Verify your SmartStock email",
      text: `Hello ${user.name},\n\nVerify your email address by opening this link:\n${verificationUrl}\n\nThis link expires in 10 minutes. If you did not request this, you can ignore this email.`,
      html: `<p>Hello ${escapeHtml(user.name)},</p><p>Verify your email address by clicking the link below. It expires in 10 minutes.</p><p><a href="${escapeHtml(verificationUrl.toString())}">Verify email address</a></p><p>If you did not request this, you can ignore this email.</p>`,
    });
  };

  const verifyEmail = async (Model, token) => {
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
      return false;
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const verifiedUser = await Model.findOneAndUpdate(
      {
        emailVerificationToken: tokenHash,
        emailVerificationExpiresAt: { $gt: now() },
      },
      {
        $set: { isEmailVerified: true },
        $unset: {
          emailVerificationToken: "",
          emailVerificationExpiresAt: "",
        },
      },
      { returnDocument: "after" },
    );

    return verifiedUser || false;
  };

  return { sendVerificationEmail, verifyEmail };
};

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

const { sendVerificationEmail, verifyEmail } =
  createEmailVerificationService();

module.exports = {
  createEmailVerificationService,
  sendVerificationEmail,
  verifyEmail,
};
