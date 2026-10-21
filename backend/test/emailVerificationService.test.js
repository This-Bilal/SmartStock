const test = require("node:test");
const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");

const {
  createEmailVerificationService,
} = require("../services/emailVerificationService");

const createUser = () => ({
  name: "Test Owner <script>",
  email: "owner@example.test",
  isEmailVerified: true,
  saveCalls: 0,
  async save() {
    this.saveCalls += 1;
  },
});

test("verification email stores only a hashed expiring token and includes a safe link", async () => {
  const user = createUser();
  const messages = [];
  const now = new Date("2026-10-18T00:00:00.000Z");
  const service = createEmailVerificationService({
    send: async (message) => messages.push(message),
    environment: {
      EMAIL_VERIFICATION_URL: "https://app.example.test/verify-email",
    },
    now: () => now,
  });

  await service.sendVerificationEmail(user, "owner");

  assert.equal(user.isEmailVerified, false);
  assert.equal(user.emailVerificationToken.length, 64);
  assert.equal(user.emailVerificationToken, user.emailVerificationToken.toLowerCase());
  assert.equal(
    user.emailVerificationExpiresAt.getTime(),
    now.getTime() + 10 * 60 * 1000,
  );
  assert.equal(user.saveCalls, 1);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].to, user.email);
  assert.match(messages[0].text, /expires in 10 minutes/);
  assert.match(messages[0].html, /expires in 10 minutes/);
  assert.match(messages[0].html, /&lt;script&gt;/);

  const url = new URL(messages[0].text.match(/https:\/\/\S+/)[0]);
  const rawToken = url.searchParams.get("token");
  assert.equal(url.searchParams.get("type"), "owner");
  assert.equal(rawToken.length, 64);
  assert.equal(
    user.emailVerificationToken,
    createHash("sha256").update(rawToken).digest("hex"),
  );
  assert.match(messages[0].html, /<p>Hello Test Owner &lt;script&gt;,<\/p>/);
});

test("production uses the deployed verification URL when no override is configured", async () => {
  const user = createUser();
  const messages = [];
  const service = createEmailVerificationService({
    send: async (message) => messages.push(message),
    environment: { NODE_ENV: "production" },
  });

  await service.sendVerificationEmail(user, "owner");

  const link = new URL(messages[0].text.match(/https:\/\/\S+/)[0]);
  assert.equal(link.origin, "https://smart-stock-beta.vercel.app");
  assert.equal(link.pathname, "/verify-email");
  assert.equal(link.searchParams.get("type"), "owner");
  assert.equal(user.saveCalls, 1);
});

test("verification consumes a valid token once and rejects invalid or expired tokens", async () => {
  const now = new Date("2026-10-18T00:00:00.000Z");
  let storedUser;
  let query;
  const Model = {
    findOneAndUpdate: async (conditions, update, options) => {
      query = conditions;
      assert.deepEqual(update, {
        $set: { isEmailVerified: true },
        $unset: {
          emailVerificationToken: "",
          emailVerificationExpiresAt: "",
        },
      });
      assert.deepEqual(options, { returnDocument: "after" });

      if (
        !storedUser ||
        storedUser.emailVerificationToken !== conditions.emailVerificationToken ||
        storedUser.emailVerificationExpiresAt <= now
      ) {
        return null;
      }

      storedUser.isEmailVerified = true;
      storedUser.emailVerificationToken = undefined;
      storedUser.emailVerificationExpiresAt = undefined;
      return storedUser;
    },
  };
  const service = createEmailVerificationService({
    send: async () => {},
    now: () => now,
  });
  storedUser = createUser();

  await service.sendVerificationEmail(storedUser, "employee");
  const rawToken = "a".repeat(64);
  storedUser.emailVerificationToken = createHash("sha256")
    .update(rawToken)
    .digest("hex");

  assert.equal(await service.verifyEmail(Model, "invalid"), false);
  assert.equal(await service.verifyEmail(Model, rawToken), storedUser);
  assert.equal(storedUser.isEmailVerified, true);
  assert.equal(storedUser.emailVerificationToken, undefined);
  assert.equal(storedUser.emailVerificationExpiresAt, undefined);
  assert.equal(await service.verifyEmail(Model, rawToken), false);
  assert.equal(query.emailVerificationExpiresAt.$gt, now);

  storedUser.isEmailVerified = false;
  storedUser.emailVerificationToken = createHash("sha256")
    .update(rawToken)
    .digest("hex");
  storedUser.emailVerificationExpiresAt = new Date(now.getTime() - 1);
  assert.equal(await service.verifyEmail(Model, rawToken), false);
});
