const test = require("node:test");
const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const bcrypt = require("bcrypt");

const {
  createPasswordResetService,
  isValidPassword,
  TOKEN_EXPIRY_MS,
} = require("../services/passwordResetService");

const createModel = (user) => ({
  user,
  async findOne({ email }) {
    return this.user?.email === email ? this.user : null;
  },
  async findOneAndUpdate(conditions, update) {
    if (!this.matches(conditions)) {
      return null;
    }
    this.apply(update);
    return this.user;
  },
  async updateOne(conditions, update) {
    if (this.matches(conditions)) {
      this.apply(update);
    }
  },
  matches(conditions) {
    if (conditions._id) {
      return this.user?._id === conditions._id;
    }
    return (
      this.user?.passwordResetToken === conditions.passwordResetToken &&
      this.user?.passwordResetExpiresAt > conditions.passwordResetExpiresAt.$gt
    );
  },
  apply(update) {
    Object.assign(this.user, update.$set || {});
    for (const field of Object.keys(update.$unset || {})) {
      delete this.user[field];
    }
  },
});

const createUser = (overrides = {}) => ({
  _id: "user-id",
  email: "user@example.test",
  name: "Test User <script>",
  password: "old-password-hash",
  ...overrides,
});

const readToken = (message) =>
  new URL(message.text.match(/https:\/\/\S+/)[0]).searchParams.get("token");

test("requests store only a hashed 20-minute token and email a safe reset link", async () => {
  const user = createUser();
  const OwnerModel = createModel(user);
  const messages = [];
  const now = new Date("2026-10-18T00:00:00.000Z");
  const service = createPasswordResetService({
    OwnerModel,
    EmployeeModel: createModel(null),
    send: async (message) => messages.push(message),
    environment: { FRONTEND_URL: "https://app.example.test" },
    now: () => now,
  });

  assert.equal(await service.requestPasswordReset(user.email, "owner"), true);

  const token = readToken(messages[0]);
  assert.match(token, /^[a-f0-9]{64}$/);
  assert.equal(
    user.passwordResetToken,
    createHash("sha256").update(token).digest("hex"),
  );
  assert.notEqual(user.passwordResetToken, token);
  assert.equal(
    user.passwordResetExpiresAt.getTime(),
    now.getTime() + TOKEN_EXPIRY_MS,
  );
  assert.equal(messages[0].subject, "Reset Your SmartStock Password");
  assert.match(messages[0].html, /&lt;script&gt;/);
  assert.match(messages[0].text, /expires in 20 minutes/);
  assert.match(messages[0].text, /ignore this email/);
  assert.equal(
    new URL(messages[0].text.match(/https:\/\/\S+/)[0]).pathname,
    "/reset-password",
  );
});

test("reset links use the configured local frontend URL", async () => {
  const messages = [];
  const service = createPasswordResetService({
    OwnerModel: createModel(createUser()),
    EmployeeModel: createModel(null),
    send: async (message) => messages.push(message),
    environment: { FRONTEND_URL: "http://localhost:5173" },
  });

  await service.requestPasswordReset("user@example.test", "owner");

  const link = new URL(messages[0].text.match(/http:\/\/\S+/)[0]);
  assert.equal(link.origin, "http://localhost:5173");
  assert.equal(link.pathname, "/reset-password");
});

test("requests use the selected account collection and replace previous tokens", async () => {
  const employee = createUser();
  const OwnerModel = createModel(null);
  const EmployeeModel = createModel(employee);
  const messages = [];
  const service = createPasswordResetService({
    OwnerModel,
    EmployeeModel,
    send: async (message) => messages.push(message),
    environment: { FRONTEND_URL: "https://app.example.test" },
  });

  await service.requestPasswordReset(employee.email, "employee");
  const oldToken = readToken(messages[0]);
  await service.requestPasswordReset(employee.email, "employee");
  const newToken = readToken(messages[1]);

  assert.notEqual(oldToken, newToken);
  assert.equal(
    employee.passwordResetToken,
    createHash("sha256").update(newToken).digest("hex"),
  );
  assert.equal(await service.resetPassword(oldToken, "new-password-123"), false);
  assert.equal(
    await service.resetPassword(newToken, "new-password-123"),
    true,
  );
  assert.equal(await bcrypt.compare("new-password-123", employee.password), true);
  assert.equal(OwnerModel.user, null);
});

test("reports when an email belongs to the other account type", async () => {
  const messages = [];
  const service = createPasswordResetService({
    OwnerModel: createModel(null),
    EmployeeModel: createModel(createUser()),
    send: async (message) => messages.push(message),
    environment: { FRONTEND_URL: "https://app.example.test" },
  });

  assert.deepEqual(
    await service.requestPasswordReset("user@example.test", "owner"),
    {
      status: "wrong_account_type",
      actualAccountType: "employee",
    },
  );
  assert.equal(messages.length, 0);
});

test("reset hashes the new password and consumes the token once", async () => {
  const user = createUser();
  user.password = await bcrypt.hash("old-password-123", 10);
  const OwnerModel = createModel(user);
  const service = createPasswordResetService({
    OwnerModel,
    EmployeeModel: createModel(null),
    send: async () => {},
    environment: { FRONTEND_URL: "https://app.example.test" },
  });
  const messages = [];
  const requestService = createPasswordResetService({
    OwnerModel,
    EmployeeModel: createModel(null),
    send: async (message) => messages.push(message),
    environment: { FRONTEND_URL: "https://app.example.test" },
  });
  await requestService.requestPasswordReset(user.email, "owner");
  const token = readToken(messages[0]);

  const results = await Promise.all([
    service.resetPassword(token, "new-password-123"),
    service.resetPassword(token, "another-password"),
  ]);
  assert.equal(results.filter(Boolean).length, 1);
  const winningPassword = results[0]
    ? "new-password-123"
    : "another-password";
  assert.notEqual(user.password, "new-password-123");
  assert.equal(
    await bcrypt.compare(winningPassword, user.password),
    true,
  );
  assert.equal(await bcrypt.compare("old-password-123", user.password), false);
  assert.equal(user.passwordResetToken, undefined);
  assert.equal(user.passwordResetExpiresAt, undefined);
  assert.equal(await service.resetPassword(token, "another-password"), false);
});

test("expired and malformed tokens are rejected", async () => {
  let now = new Date("2026-10-18T00:00:00.000Z");
  const user = createUser();
  const messages = [];
  const service = createPasswordResetService({
    OwnerModel: createModel(user),
    EmployeeModel: createModel(null),
    send: async (message) => messages.push(message),
    environment: { FRONTEND_URL: "https://app.example.test" },
    now: () => now,
  });
  await service.requestPasswordReset(user.email, "owner");
  const token = readToken(messages[0]);

  assert.equal(await service.resetPassword("invalid", "new-password-123"), false);
  now = new Date(now.getTime() + TOKEN_EXPIRY_MS + 1);
  assert.equal(await service.resetPassword(token, "new-password-123"), false);
});

test("email failure clears the issued token without exposing recipient details", async () => {
  const user = createUser();
  const OwnerModel = createModel(user);
  const errors = [];
  const service = createPasswordResetService({
    OwnerModel,
    EmployeeModel: createModel(null),
    send: async () => {
      throw new Error("private delivery details");
    },
    environment: { FRONTEND_URL: "https://app.example.test" },
    logger: { error: (message) => errors.push(message) },
  });

  assert.equal(await service.requestPasswordReset(user.email, "owner"), false);
  assert.equal(user.passwordResetToken, undefined);
  assert.equal(user.passwordResetExpiresAt, undefined);
  assert.deepEqual(errors, [
    "[password-reset] Reset email could not be sent.",
  ]);
});

test("password validation matches bcrypt's supported byte length", () => {
  assert.equal(isValidPassword("short"), false);
  assert.equal(isValidPassword("12345678"), true);
  assert.equal(isValidPassword("a".repeat(73)), false);
  assert.equal(isValidPassword("😀".repeat(19)), false);
  assert.equal(isValidPassword("😀".repeat(8)), true);
});
