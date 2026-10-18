const test = require("node:test");
const assert = require("node:assert/strict");

const { getEmailConfig } = require("../config/emailConfig");
const { createEmailService } = require("../services/emailService");

const createLogger = () => {
  const entries = [];
  return {
    entries,
    info: (message) => entries.push(["info", message]),
    warn: (message) => entries.push(["warn", message]),
    error: (message) => entries.push(["error", message]),
  };
};

test("email configuration applies SMTP defaults and sender precedence", () => {
  const defaults = getEmailConfig({});
  assert.equal(defaults.host, "smtp.gmail.com");
  assert.equal(defaults.port, 587);
  assert.equal(defaults.secure, false);
  assert.equal(defaults.from, "noreply@smartstock.com");
  assert.equal(defaults.hasCredentials, false);

  const configured = getEmailConfig({
    EMAIL_HOST: "mail.example.test",
    EMAIL_PORT: "465",
    EMAIL_SECURE: "true",
    EMAIL_USER: "mailer@example.test",
    EMAIL_PASSWORD: "secret",
  });
  assert.equal(configured.host, "mail.example.test");
  assert.equal(configured.port, 465);
  assert.equal(configured.secure, true);
  assert.equal(configured.from, "mailer@example.test");
  assert.equal(configured.hasCredentials, true);
  assert.equal(
    getEmailConfig({
      EMAIL_USER: "mailer@example.test",
      EMAIL_PASSWORD: "secret",
      EMAIL_FROM: "custom@example.test",
    }).from,
    "custom@example.test",
  );
});

test("EMAIL_SECURE is true only for the exact string true", () => {
  assert.equal(getEmailConfig({ EMAIL_SECURE: "TRUE" }).secure, false);
  assert.equal(getEmailConfig({ EMAIL_SECURE: "1" }).secure, false);
});

test("invalid SMTP ports are rejected", () => {
  assert.throws(
    () => getEmailConfig({ EMAIL_PORT: "not-a-port" }),
    /EMAIL_PORT must be an integer/,
  );
});

test("email service verifies one reusable transporter and sends from the configured address", async () => {
  const logger = createLogger();
  const sentMessages = [];
  let createTransportCalls = 0;
  let verifyCalls = 0;
  const mailer = {
    createTransport: (options) => {
      createTransportCalls += 1;
      assert.deepEqual(options, {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user: "mailer@example.test", pass: "secret" },
      });
      return {
        verify: async () => {
          verifyCalls += 1;
        },
        sendMail: async (message) => {
          sentMessages.push(message);
          return { messageId: "test-id" };
        },
      };
    },
  };
  const service = createEmailService({
    environment: {
      EMAIL_USER: "mailer@example.test",
      EMAIL_PASSWORD: "secret",
    },
    mailer,
    logger,
  });

  const firstResult = await service.sendEmail({
    to: "owner@example.test",
    subject: "Welcome",
    text: "Welcome to SmartStock",
  });
  const secondResult = await service.sendEmail({
    to: "other@example.test",
    subject: "Notice",
    html: "<p>Notice</p>",
  });

  assert.equal(firstResult.messageId, "test-id");
  assert.equal(secondResult.messageId, "test-id");
  assert.equal(createTransportCalls, 1);
  assert.equal(verifyCalls, 1);
  assert.equal(sentMessages[0].from, "mailer@example.test");
  assert.equal(sentMessages[1].from, "mailer@example.test");
});

test("missing development credentials warn and never attempt SMTP or report a successful send", async () => {
  const logger = createLogger();
  let createTransportCalls = 0;
  const service = createEmailService({
    environment: { NODE_ENV: "development" },
    mailer: {
      createTransport: () => {
        createTransportCalls += 1;
        throw new Error("must not create transport");
      },
    },
    logger,
  });

  await assert.rejects(
    service.sendEmail({ to: "owner@example.test", subject: "Test", text: "Hi" }),
    /Email delivery is disabled/,
  );

  assert.equal(createTransportCalls, 0);
  assert.equal(logger.entries[0][0], "warn");
  assert.match(logger.entries[0][1], /disabled in development/);
});

test("production credentials are required", async () => {
  const service = createEmailService({
    environment: { NODE_ENV: "production" },
    mailer: { createTransport: () => assert.fail("must not create transport") },
    logger: createLogger(),
  });

  await assert.rejects(
    service.initialize(),
    /EMAIL_USER and EMAIL_PASSWORD are required/,
  );
});

test("SMTP verification and send failures are logged and rejected", async () => {
  const logger = createLogger();
  const verificationFailure = createEmailService({
    environment: {
      EMAIL_USER: "mailer@example.test",
      EMAIL_PASSWORD: "secret",
    },
    mailer: {
      createTransport: () => ({
        verify: async () => {
          throw new Error("secret must not be logged");
        },
      }),
    },
    logger,
  });
  await assert.rejects(
    verificationFailure.initialize(),
    /Email SMTP transporter verification failed/,
  );
  assert.equal(logger.entries[0][0], "error");
  assert.doesNotMatch(logger.entries[0][1], /secret/);

  const sendFailure = createEmailService({
    environment: {
      EMAIL_USER: "mailer@example.test",
      EMAIL_PASSWORD: "secret",
    },
    mailer: {
      createTransport: () => ({
        verify: async () => {},
        sendMail: async () => {
          throw new Error("secret must not be logged");
        },
      }),
    },
    logger,
  });
  await assert.rejects(
    sendFailure.sendEmail({
      to: "owner@example.test",
      subject: "Test",
      text: "Hi",
    }),
    /Email delivery failed/,
  );
  assert.equal(logger.entries.at(-1)[0], "error");
  assert.doesNotMatch(logger.entries.at(-1)[1], /secret/);
});
