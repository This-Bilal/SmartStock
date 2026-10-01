const asyncHandler = require("express-async-handler");

const {
  getPlanLimits,
  getAvailablePlans,
  canUseFeature,
  resolveSubscription,
  updateSubscriptionPlan,
  cancelSubscription,
} = require("../services/subscriptionService");

// Get current subscription and available plans
const getCurrentSubscription = asyncHandler(async (req, res) => {
  const subscription = await resolveSubscription(req.user);

  const planLimits = getPlanLimits(subscription.plan);
  const plans = getAvailablePlans();

  res.status(200).json({
    subscription: {
      id: subscription._id,
      plan: subscription.plan,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      limits: planLimits,
    },

    plans,
  });
});

// Check whether a subscription feature is available
const checkSubscriptionFeature = asyncHandler(async (req, res) => {
  const { feature } = req.params;

  const subscription = await resolveSubscription(req.user);

  const allowed = canUseFeature(subscription, feature);

  res.status(200).json({
    plan:
      subscription.status === "active" ||
      subscription.status === "trialing"
        ? subscription.plan
        : "free",
    feature,
    allowed,
  });
});

// Update subscription
const updateSubscription = asyncHandler(async (req, res) => {
  const { plan } = req.body;

  if (!plan) {
    return res.status(400).json({
      message: "Subscription plan is required.",
    });
  }

  const subscription = await updateSubscriptionPlan(
    req.user,
    plan,
  );

  const planLimits = getPlanLimits(subscription.plan);

  res.status(200).json({
    message: `Subscription updated to ${subscription.plan}.`,

    subscription: {
      id: subscription._id,
      plan: subscription.plan,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      limits: planLimits,
    },
  });
});

// Cancel current subscription
const cancelCurrentSubscription = asyncHandler(
  async (req, res) => {
    const result = await cancelSubscription(req.user);

    if (!result.success) {
      return res.status(400).json({
        message: result.message,
      });
    }

    const subscription = result.subscription;

    res.status(200).json({
      message:
        "Subscription cancelled successfully. Your current plan will remain active until the end date.",

      subscription: {
        id: subscription._id,
        plan: subscription.plan,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      },
    });
  },
);

module.exports = {
  getCurrentSubscription,
  checkSubscriptionFeature,
  updateSubscription,
  cancelCurrentSubscription,
};