const getEmailConfig = (environment = process.env) => {
  const rawPort = environment.EMAIL_PORT || "587";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("EMAIL_PORT must be an integer between 1 and 65535.");
  }

  const user = environment.EMAIL_USER || "";
  const password = environment.EMAIL_PASSWORD || "";

  return {
    host: environment.EMAIL_HOST || "smtp.gmail.com",
    port,
    secure: environment.EMAIL_SECURE === "true",
    user,
    password,
    from: environment.EMAIL_FROM || user || "noreply@smartstock.com",
    hasCredentials: Boolean(user && password),
    isDevelopment:
      !environment.NODE_ENV ||
      environment.NODE_ENV === "development" ||
      environment.NODE_ENV === "test",
  };
};

module.exports = { getEmailConfig };
