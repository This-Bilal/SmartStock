const axios = require("axios");

const Payment = require("../models/paymentModel");
const PLAN_LIMITS = require("../config/planLimits");

const {
  updateSubscriptionPlan,
} = require("./subscriptionService");

const PAYSTACK_URL = "https://api.paystack.co";

// Get the Paystack amount for a paid plan
const getPaymentAmount = (plan) => {
  const planData = PLAN_LIMITS[plan];

  if (!planData || plan === "free" || !planData.price) {
    throw new Error("Invalid paid subscription plan.");
  }

  // Convert naira to kobo for Paystack
  return planData.price * 100;
};

// Initialize payment
const initializePayment = async ({
  email,
  plan,
  reference,
}) => {
  const amount = getPaymentAmount(plan);

  const response = await axios.post(
    `${PAYSTACK_URL}/transaction/initialize`,
    {
      email,
      amount,
      currency: "NGN",
      reference,
      callback_url: process.env.PAYSTACK_CALLBACK_URL,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

// Verify payment
const verifyPayment = async (reference) => {
  const response = await axios.get(
    `${PAYSTACK_URL}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  return response.data;
};

// Process successful payment
const processSuccessfulPayment = async (
  payment,
  transaction,
) => {
  // Make sure the reference matches
  if (transaction.reference !== payment.reference) {
    throw new Error("Payment reference does not match.");
  }

  // Make sure the amount matches
  if (transaction.amount !== payment.amount) {
    throw new Error(
      "Payment amount does not match the subscription plan.",
    );
  }

  // Make sure the currency is NGN
  if (transaction.currency !== "NGN") {
    throw new Error("Payment currency is invalid.");
  }

  // Prevent duplicate processing
  if (payment.status === "success") {
    return {
      alreadyProcessed: true,
      payment,
    };
  }

  // Update subscription
  const subscription = await updateSubscriptionPlan(
    {
      _id: payment.owner,
      role: "owner",
    },
    payment.plan,
  );

  // Mark payment as successful
  payment.status = "success";
  payment.paystackTransactionId = transaction.id;
  payment.paidAt = transaction.paid_at
    ? new Date(transaction.paid_at)
    : new Date();

  await payment.save();

  return {
    alreadyProcessed: false,
    payment,
    subscription,
  };
};

module.exports = {
  getPaymentAmount,
  initializePayment,
  verifyPayment,
  processSuccessfulPayment,
};