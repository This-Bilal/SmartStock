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
        } catch {
          transporter = undefined;
          logger.error(
            "[email] SMTP transporter initialization failed; check SMTP configuration and availability.",
          );
          throw new Error("Email SMTP transporter verification failed.");
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
    } catch {
      logger.error("[email] Email delivery failed.");
      throw new Error("Email delivery failed.");
    }
  };

  return {
    initialize,
    sendEmail,
  };
};

const emailService = createEmailService();

module.exports = {
  createEmailService,
  initializeEmailService: emailService.initialize,
  sendEmail: emailService.sendEmail,
};
