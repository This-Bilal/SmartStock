const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

const Payment = require("../models/paymentModel");

const {
  getPaymentAmount,
  initializePayment,
  verifyPayment,
  processSuccessfulPayment,
} = require("../services/paymentService");

const { getOwnerId } = require("../services/subscriptionService");

const initializeSubscriptionPayment = asyncHandler(async (req, res) => {
  const { plan } = req.body;

  if (!plan) {
    return res.status(400).json({
      message: "Subscription plan is required.",
    });
  }

  let amount;

  try {
    amount = getPaymentAmount(plan);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const ownerId = getOwnerId(req.user);

  const reference = `SS-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;

  const payment = await Payment.create({
    owner: ownerId,
    plan,
    amount,
    reference,
    status: "pending",
  });

  const email = req.user.email;

  const paystackResponse = await initializePayment({
    email,
    plan,
    reference,
  });

  res.status(200).json({
    message: "Payment initialized successfully.",

    payment: {
      reference,
      plan,
      amount,
    },

    authorizationUrl: paystackResponse.data.authorization_url,

    accessCode: paystackResponse.data.access_code,
  });
});

const verifySubscriptionPayment = asyncHandler(async (req, res) => {
  const { reference } = req.params;

  if (!reference) {
    return res.status(400).json({
      message: "Payment reference is required.",
    });
  }

  const ownerId = getOwnerId(req.user);

  const payment = await Payment.findOne({
    reference,
    owner: ownerId,
  });

  if (!payment) {
    return res.status(404).json({
      message: "Payment record not found.",
    });
  }

  if (payment.status === "success") {
    return res.status(200).json({
      message: "Payment has already been verified.",
      payment: {
        reference: payment.reference,
        plan: payment.plan,
        amount: payment.amount,
        status: payment.status,
        paidAt: payment.paidAt,
      },
    });
  }

  const result = await verifyPayment(reference);

  const transaction = result.data;

  // Paystack did not return a valid transaction
  if (!result.status || !transaction) {
    return res.status(400).json({
      message: "Unable to verify payment.",
    });
  }

  // Payment failed
  if (transaction.status === "failed") {
    payment.status = "failed";

    await payment.save();

    return res.status(400).json({
      message: "Payment failed.",
      payment: {
        reference: payment.reference,
        plan: payment.plan,
        amount: payment.amount,
        status: payment.status,
      },
    });
  }

  // Payment is still pending
  if (transaction.status !== "success") {
    return res.status(400).json({
      message: "Payment has not been completed.",
      payment: {
        reference: payment.reference,
        plan: payment.plan,
        amount: payment.amount,
        status: payment.status,
      },
    });
  }

  // Successful payment
  const processedPayment = await processSuccessfulPayment(payment, transaction);

  res.status(200).json({
    message: "Payment verified and subscription updated successfully.",

    payment: {
      reference: payment.reference,
      plan: payment.plan,
      amount: payment.amount,
      status: payment.status,
      paidAt: payment.paidAt,
    },

    subscription: processedPayment.subscription
      ? {
          id: processedPayment.subscription._id,
          plan: processedPayment.subscription.plan,
          status: processedPayment.subscription.status,
          startDate: processedPayment.subscription.startDate,
          endDate: processedPayment.subscription.endDate,
        }
      : null,
  });
});

const handlePaystackWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-paystack-signature"];

  if (!signature) {
    return res.sendStatus(401);
  }

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(req.rawBody)
    .digest("hex");

  const signatureBuffer = Buffer.from(signature, "hex");

  const hashBuffer = Buffer.from(hash, "hex");

  if (
    signatureBuffer.length !== hashBuffer.length ||
    !crypto.timingSafeEqual(hashBuffer, signatureBuffer)
  ) {
    return res.sendStatus(401);
  }

  const event = req.body;

  // We only need successful transaction events
  if (event.event !== "charge.success") {
    return res.sendStatus(200);
  }

  const transaction = event.data;

  const payment = await Payment.findOne({
    reference: transaction.reference,
  });

  if (!payment) {
    return res.status(404).json({
      message: "Payment record not found.",
    });
  }

  await processSuccessfulPayment(payment, transaction);

  return res.sendStatus(200);
});

const getPaymentByReference = asyncHandler(async (req, res) => {
  const { reference } = req.params;

  if (!reference) {
    return res.status(400).json({
      message: "Payment reference is required.",
    });
  }

  const ownerId = getOwnerId(req.user);

  const payment = await Payment.findOne({
    reference,
    owner: ownerId,
  }).select("reference plan amount status paidAt createdAt");

  if (!payment) {
    return res.status(404).json({
      message: "Payment record not found.",
    });
  }

  res.status(200).json({
    payment: {
      reference: payment.reference,
      plan: payment.plan,
      amount: payment.amount,
      status: payment.status,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
    },
  });
});

module.exports = {
  initializeSubscriptionPayment,
  verifySubscriptionPayment,
  handlePaystackWebhook,
  getPaymentByReference,
};
