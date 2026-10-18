const nodemailer = require("nodemailer");
const { getEmailConfig } = require("../config/emailConfig");

const createEmailService = ({
  environment = process.env,
  mailer = nodemailer,
  logger = console,
} = {}) => {
  const config = getEmailConfig(environment);
  let transporter;
  let initialization;

  const initialize = async () => {
    if (!initialization) {
      initialization = (async () => {
        if (!config.hasCredentials) {
          if (!config.isDevelopment) {
            throw new Error(
              "EMAIL_USER and EMAIL_PASSWORD are required outside development.",
            );
          }

          logger.warn(
            "[email] SMTP credentials are not configured; email delivery is disabled in development.",
          );
          return false;
        }

        try {
          transporter = mailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
              user: config.user,
              pass: config.password,
            },
          });
          await transporter.verify();
          logger.info("[email] SMTP transporter verified.");
          return true;
        } catch (error) {
          transporter = undefined;
          const details = getSafeErrorDetails(error);
          logger.error(
            `[email] SMTP transporter initialization failed (${details}).`,
          );
          throw new Error(
            `Email SMTP transporter verification failed (${details}).`,
          );
        }
      })();
    }

    try {
      return await initialization;
    } catch (error) {
      initialization = undefined;
      throw error;
    }
  };

  const sendEmail = async (message) => {
    const ready = await initialize();

    if (!ready || !transporter) {
      throw new Error(
        "Email delivery is disabled because SMTP credentials are not configured.",
      );
    }

    try {
      return await transporter.sendMail({
        ...message,
        from: message.from || config.from,
      });
    } catch (error) {
      const details = getSafeErrorDetails(error);
      logger.error(`[email] Email delivery failed (${details}).`);
      throw new Error(`Email delivery failed (${details}).`);
    }
  };

  return {
    initialize,
    sendEmail,
  };
};

const getSafeErrorDetails = (error) => {
  const code =
    typeof error?.code === "string" && /^[A-Z0-9_]+$/.test(error.code)
      ? error.code
      : "UNKNOWN";
  const responseCode = Number.isInteger(error?.responseCode)
    ? `response ${error.responseCode}`
    : null;

  return [code, responseCode].filter(Boolean).join(", ");
};

const emailService = createEmailService();

module.exports = {
  createEmailService,
  initializeEmailService: emailService.initialize,
  sendEmail: emailService.sendEmail,
};
