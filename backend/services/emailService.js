const { getEmailConfig } = require("../config/emailConfig");

const createEmailService = ({
  environment = process.env,
  fetchImpl = globalThis.fetch,
  logger = console,
} = {}) => {
  const config = getEmailConfig(environment);
  let missingKeyWarningLogged = false;

  const initialize = async () => {
    if (!config.hasCredentials) {
      if (config.isDevelopment) {
        if (!missingKeyWarningLogged) {
          logger.warn(
            "[email] BREVO_API_KEY is not configured; email delivery is disabled in development.",
          );
          missingKeyWarningLogged = true;
        }
        return false;
      }

      throw new Error("BREVO_API_KEY is required to send email.");
    }

    if (!config.isDevelopment && !config.hasSender) {
      throw new Error(
        "EMAIL_FROM must be set to a sender address verified in Brevo.",
      );
    }

    if (typeof fetchImpl !== "function") {
      throw new Error("Email delivery requires a runtime with the Fetch API.");
    }

    return true;
  };

  const sendEmail = async (message) => {
    const ready = await initialize();

    if (!ready) {
      throw new Error(
        "Email delivery is disabled because BREVO_API_KEY is not configured.",
      );
    }

    const recipients = normalizeRecipients(message.to);
    if (!message.subject || (!message.text && !message.html)) {
      throw new Error("Email subject and message content are required.");
    }

    const payload = {
      sender: {
        email: config.from,
        name: config.fromName,
      },
      to: recipients,
      subject: message.subject,
      textContent: message.text || stripHtml(message.html),
      htmlContent: message.html || textToHtml(message.text),
      ...(message.replyTo
        ? { replyTo: normalizeSender(message.replyTo) }
        : {}),
    };

    try {
      const response = await fetchImpl("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": config.apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        logger.error(
          `[email] Brevo rejected email delivery (HTTP ${response.status}).`,
        );
        throw new Error(
          `Brevo email API request failed (HTTP ${response.status}).`,
        );
      }

      const result = await response.json();
      logger.info("[email] Email accepted by Brevo.");
      return result;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith("Brevo email API")
      ) {
        throw error;
      }

      const details = getSafeErrorDetails(error);
      logger.error(`[email] Brevo email request failed (${details}).`);
      throw new Error(`Brevo email delivery failed (${details}).`);
    }
  };

  return {
    initialize,
    sendEmail,
  };
};

const normalizeRecipients = (to) => {
  const recipients = Array.isArray(to) ? to : [to];

  if (
    recipients.length === 0 ||
    recipients.some(
      (recipient) =>
        !isValidEmail(
          typeof recipient === "string" ? recipient : recipient?.email,
        ),
    )
  ) {
    throw new Error("A valid email recipient is required.");
  }

  return recipients.map((recipient) =>
    typeof recipient === "string"
      ? { email: recipient }
      : {
          email: recipient.email,
          ...(recipient.name ? { name: recipient.name } : {}),
        },
  );
};

const normalizeSender = (sender) => {
  if (typeof sender === "string") {
    if (!isValidEmail(sender)) {
      throw new Error("Reply-to must be a valid email address.");
    }
    return { email: sender };
  }

  if (!sender || !isValidEmail(sender.email)) {
    throw new Error("Reply-to must be a valid email address.");
  }

  return {
    email: sender.email,
    ...(sender.name ? { name: sender.name } : {}),
  };
};

const isValidEmail = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const stripHtml = (html) => String(html || "").replace(/<[^>]*>/g, " ");

const textToHtml = (text) =>
  `<p>${String(text || "")
    .replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entities[character];
    })
    .replace(/\r?\n/g, "<br>")}</p>`;

const getSafeErrorDetails = (error) => {
  const code =
    typeof error?.cause?.code === "string" &&
    /^[A-Z0-9_]+$/.test(error.cause.code)
      ? error.cause.code
      : typeof error?.code === "string" && /^[A-Z0-9_]+$/.test(error.code)
      ? error.code
      : "UNKNOWN";

  return code;
};

const emailService = createEmailService();

module.exports = {
  createEmailService,
  initializeEmailService: emailService.initialize,
  sendEmail: emailService.sendEmail,
};
