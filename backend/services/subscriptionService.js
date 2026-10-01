const Subscription = require("../models/subscriptionModel");
const PLAN_LIMITS = require("../config/planLimits");
const { syncOwnerResourcesWithPlan } = require("./subscriptionResourceService");

// Get the owner ID from the logged-in user
const getOwnerId = (user) => {
  return user.role === "owner" ? user._id : user.owner;
};

// Get the owner's subscription
// If the owner does not have one yet, create a Free subscription
const getSubscription = async (user) => {
  const ownerId = getOwnerId(user);

  const subscription = await Subscription.findOneAndUpdate(
    { owner: ownerId },
    {
      $setOnInsert: {
        owner: ownerId,
        plan: "free",
        status: "active",
      },
    },
    {
      returnDocument: "after",
      upsert: true,
    },
  );

  return subscription;
};

// Resolve the current subscription status
const resolveSubscription = async (user) => {
  const subscription = await getSubscription(user);

  // Subscription has no expiry.
  // This normally means the Free plan.
  if (!subscription.endDate) {
    await syncOwnerResourcesWithPlan(subscription.owner, subscription.plan);

    return subscription;
  }

  // Still within the subscription period.
  if (new Date() < subscription.endDate) {
    await syncOwnerResourcesWithPlan(subscription.owner, subscription.plan);

    return subscription;
  }

  // Subscription period has ended.
  // The subscription now becomes Free.
  subscription.plan = "free";
  subscription.status = "active";
  subscription.startDate = new Date();
  subscription.endDate = null;

  await subscription.save();

  // Synchronize resources with the Free plan.
  await syncOwnerResourcesWithPlan(subscription.owner, "free");

  return subscription;
};

// Get limits and features for a plan
const getPlanLimits = (plan) => {
  return PLAN_LIMITS[plan];
};

// Get all available subscription plans
const getAvailablePlans = () => {
  return Object.entries(PLAN_LIMITS).map(([id, plan]) => ({
    id,
    name: plan.name,
    price: plan.price,
    description: plan.description,

    limits: {
      maxProducts:
        plan.maxProducts === Infinity ? "Unlimited" : plan.maxProducts,

      maxEmployees:
        plan.maxEmployees === Infinity ? "Unlimited" : plan.maxEmployees,

      advancedReports: plan.advancedReports,
      saleDetails: plan.saleDetails,
      inventoryHistory: plan.inventoryHistory,
    },
  }));
};

// Check whether a feature is available
const canUseFeature = (subscription, feature) => {
  const plan =
    subscription.status === "active" || subscription.status === "trialing"
      ? subscription.plan
      : "free";

  const planLimits = getPlanLimits(plan);

  return planLimits?.[feature] === true;
};

// Check whether a resource limit has been reached
const checkPlanLimit = async (user, limitName, currentUsage) => {
  const subscription = await resolveSubscription(user);

  const plan = subscription.status === "expired" ? "free" : subscription.plan;

  const planLimits = getPlanLimits(plan);

  const limit = planLimits?.[limitName];

  if (limit === undefined) {
    throw new Error(`Limit "${limitName}" is not defined`);
  }

  if (limit === Infinity) {
    return {
      allowed: true,
      plan,
      limit,
      currentUsage,
    };
  }

  if (currentUsage >= limit) {
    return {
      allowed: false,
      plan,
      limit,
      currentUsage,
    };
  }

  return {
    allowed: true,
    plan,
    limit,
    currentUsage,
  };
};

// Update subscription plan
const updateSubscriptionPlan = async (user, newPlan) => {
  const validPlans = ["free", "basic", "pro"];

  if (!validPlans.includes(newPlan)) {
    throw new Error("Invalid subscription plan.");
  }

  const ownerId = getOwnerId(user);

  const subscription = await Subscription.findOne({
    owner: ownerId,
  });

  if (!subscription) {
    throw new Error("Subscription not found.");
  }

  const now = new Date();

  // Switching to Free
  if (newPlan === "free") {
    subscription.plan = "free";
    subscription.status = "active";
    subscription.startDate = now;
    subscription.endDate = null;

    await subscription.save();

    // Apply Free resource limits
    await syncOwnerResourcesWithPlan(ownerId, "free");

    return subscription;
  }

  // Renewing the same paid plan
  // Also reactivates a cancelled subscription
  if (
    subscription.plan === newPlan &&
    subscription.endDate &&
    subscription.endDate > now
  ) {
    const newEndDate = new Date(subscription.endDate);

    newEndDate.setDate(newEndDate.getDate() + 30);

    subscription.status = "active";
    subscription.endDate = newEndDate;

    await subscription.save();

    // Make sure resources match the renewed plan
    await syncOwnerResourcesWithPlan(ownerId, newPlan);

    return subscription;
  }

  // Switching to a different plan
  // OR activating a paid plan after expiration
  const endDate = new Date(now);

  endDate.setDate(endDate.getDate() + 30);

  subscription.plan = newPlan;
  subscription.status = "active";
  subscription.startDate = now;
  subscription.endDate = endDate;

  await subscription.save();

  // Apply the new plan's resource limits
  await syncOwnerResourcesWithPlan(ownerId, newPlan);

  return subscription;
};

// Cancel current subscription
const cancelSubscription = async (user) => {
  const subscription = await resolveSubscription(user);

  // Free plans do not need cancellation
  if (subscription.plan === "free") {
    return {
      success: false,
      message: "Free plan cannot be cancelled.",
    };
  }

  // Already cancelled
  if (subscription.status === "cancelled") {
    return {
      success: false,
      message: "Subscription is already cancelled.",
    };
  }

  // Already expired
  if (subscription.status === "expired") {
    return {
      success: false,
      message: "Subscription has already expired.",
    };
  }

  subscription.status = "cancelled";

  await subscription.save();

  return {
    success: true,
    subscription,
  };
};

module.exports = {
  getOwnerId,
  getSubscription,
  getPlanLimits,
  getAvailablePlans,
  canUseFeature,
  checkPlanLimit,
  resolveSubscription,
  updateSubscriptionPlan,
  cancelSubscription,
};
