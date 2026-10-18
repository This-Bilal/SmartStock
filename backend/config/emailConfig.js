const getEmailConfig = (environment = process.env) => {
  const apiKey = environment.BREVO_API_KEY || "";

  return {
    apiKey,
    from: environment.EMAIL_FROM || "noreply@smartstock.com",
    hasSender: Boolean(environment.EMAIL_FROM),
    fromName: environment.EMAIL_FROM_NAME || "SmartStock",
    verificationUrl:
      environment.EMAIL_VERIFICATION_URL ||
      "https://smart-stock-beta.vercel.app/verify-email",
    hasCredentials: Boolean(apiKey),
    isDevelopment:
      !environment.NODE_ENV ||
      environment.NODE_ENV === "development" ||
      environment.NODE_ENV === "test",
  };
};

module.exports = { getEmailConfig };
