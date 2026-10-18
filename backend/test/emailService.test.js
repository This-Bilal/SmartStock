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

test("email configuration reads Brevo credentials and sender settings", () => {
  const defaults = getEmailConfig({});
  assert.equal(defaults.apiKey, "");
  assert.equal(defaults.from, "noreply@smartstock.com");
  assert.equal(defaults.hasSender, false);
  assert.equal(defaults.fromName, "SmartStock");
  assert.equal(
    defaults.verificationUrl,
    "https://smart-stock-beta.vercel.app/verify-email",
  );
  assert.equal(defaults.hasCredentials, false);

  const configured = getEmailConfig({
    BREVO_API_KEY: "brevo-secret",
    EMAIL_FROM: "verified@example.test",
    EMAIL_FROM_NAME: "Example Stock",
    EMAIL_VERIFICATION_URL: "https://app.example.test/verify-email",
  });
  assert.equal(configured.apiKey, "brevo-secret");
  assert.equal(configured.from, "verified@example.test");
  assert.equal(configured.hasSender, true);
  assert.equal(configured.fromName, "Example Stock");
  assert.equal(
    configured.verificationUrl,
    "https://app.example.test/verify-email",
  );
  assert.equal(configured.hasCredentials, true);
});

test("email service sends Brevo transactional email with API-key authentication", async () => {
  const logger = createLogger();
  const requests = [];
  const service = createEmailService({
    environment: {
      NODE_ENV: "production",
      BREVO_API_KEY: "brevo-secret",
      EMAIL_FROM: "verified@example.test",
      EMAIL_FROM_NAME: "SmartStock Mail",
    },
    fetchImpl: async (...args) => {
      requests.push(args);
      return {
        ok: true,
        status: 201,
        json: async () => ({ messageId: "brevo-message-id" }),
      };
    },
    logger,
  });

  const result = await service.sendEmail({
    to: { email: "owner@example.test", name: "Owner" },
    subject: "Verify your email",
    text: "Open the link.",
    html: "<p>Open the link.</p>",
    replyTo: "support@example.test",
  });

  assert.deepEqual(result, { messageId: "brevo-message-id" });
  assert.equal(requests.length, 1);
  assert.equal(requests[0][0], "https://api.brevo.com/v3/smtp/email");
  assert.equal(requests[0][1].method, "POST");
  assert.equal(requests[0][1].headers["api-key"], "brevo-secret");
  assert.equal(requests[0][1].headers["content-type"], "application/json");
  assert.deepEqual(JSON.parse(requests[0][1].body), {
    sender: { email: "verified@example.test", name: "SmartStock Mail" },
    to: [{ email: "owner@example.test", name: "Owner" }],
    subject: "Verify your email",
    textContent: "Open the link.",
    htmlContent: "<p>Open the link.</p>",
    replyTo: { email: "support@example.test" },
  });
  assert.equal(logger.entries.at(-1)[0], "info");
});

test("multiple recipients and text-only messages are normalized", async () => {
  let payload;
  const service = createEmailService({
    environment: { BREVO_API_KEY: "brevo-secret" },
    fetchImpl: async (_url, options) => {
      payload = JSON.parse(options.body);
      return { ok: true, status: 201, json: async () => ({ messageId: "id" }) };
    },
    logger: createLogger(),
  });

  await service.sendEmail({
    to: ["one@example.test", { email: "two@example.test", name: "Two" }],
    subject: "Notice",
    text: "Plain text",
  });

  assert.deepEqual(payload.to, [
    { email: "one@example.test" },
    { email: "two@example.test", name: "Two" },
  ]);
  assert.equal(payload.textContent, "Plain text");
  assert.equal(payload.htmlContent, "<p>Plain text</p>");
});

test("missing Brevo credentials log a development notice and reject delivery", async () => {
  const logger = createLogger();
  let fetchCalls = 0;
  const service = createEmailService({
    environment: { NODE_ENV: "development" },
    fetchImpl: async () => {
      fetchCalls += 1;
    },
    logger,
  });

  await assert.rejects(
    service.sendEmail({ to: "owner@example.test", subject: "Test", text: "Hi" }),
    /BREVO_API_KEY is not configured/,
  );
  await service.initialize();

  assert.equal(fetchCalls, 0);
  assert.equal(logger.entries.filter(([level]) => level === "warn").length, 1);
  assert.match(logger.entries[0][1], /disabled in development/);
});

test("Brevo API key is required outside development", async () => {
  const service = createEmailService({
    environment: { NODE_ENV: "production" },
    fetchImpl: async () => assert.fail("must not call Brevo"),
    logger: createLogger(),
  });

  await assert.rejects(service.initialize(), /BREVO_API_KEY is required/);
});

test("production requires an explicitly configured Brevo-verified sender", async () => {
  const service = createEmailService({
    environment: { NODE_ENV: "production", BREVO_API_KEY: "brevo-secret" },
    fetchImpl: async () => assert.fail("must not call Brevo"),
    logger: createLogger(),
  });

  await assert.rejects(
    service.initialize(),
    /EMAIL_FROM must be set to a sender address verified in Brevo/,
  );
});

test("Brevo HTTP and network failures are reported without leaking credentials", async () => {
  const logger = createLogger();
  const rejectedRequest = createEmailService({
    environment: {
      BREVO_API_KEY: "brevo-secret",
    },
    fetchImpl: async () => ({
      ok: false,
      status: 401,
      json: async () => ({ message: "sensitive server response" }),
    }),
    logger,
  });

  await assert.rejects(
    rejectedRequest.sendEmail({
      to: "owner@example.test",
      subject: "Test",
      text: "Hi",
    }),
    /Brevo email API request failed \(HTTP 401\)/,
  );
  assert.doesNotMatch(logger.entries.at(-1)[1], /sensitive|secret/);

  const networkFailure = createEmailService({
    environment: { BREVO_API_KEY: "brevo-secret" },
    fetchImpl: async () => {
      const error = new Error("brevo-secret must never appear in logs");
      error.cause = { code: "ETIMEDOUT" };
      throw error;
    },
    logger,
  });

  await assert.rejects(
    networkFailure.sendEmail({
      to: "owner@example.test",
      subject: "Test",
      text: "Hi",
    }),
    /Brevo email delivery failed \(ETIMEDOUT\)/,
  );
  assert.match(logger.entries.at(-1)[1], /ETIMEDOUT/);
  assert.doesNotMatch(logger.entries.at(-1)[1], /secret/);
});

test("message content and recipients are required", async () => {
  const service = createEmailService({
    environment: { BREVO_API_KEY: "brevo-secret" },
    fetchImpl: async () => assert.fail("must not call Brevo"),
    logger: createLogger(),
  });

  await assert.rejects(
    service.sendEmail({ to: "owner@example.test", subject: "Test" }),
    /Email subject and message content are required/,
  );
  await assert.rejects(
    service.sendEmail({ to: "", subject: "Test", text: "Hi" }),
    /valid email recipient/,
  );
});
