const Product = require("../models/productModel");
const Employee = require("../models/employeeModel");
const PLAN_LIMITS = require("../config/planLimits");

// Synchronize one resource type with the plan limit
const syncResourceLimit = async (Model, ownerId, limit) => {
  const resources = await Model.find({
    owner: ownerId,
  }).sort({ createdAt: 1 });

  if (resources.length === 0) {
    return;
  }

  // Unlimited plan
  if (limit === Infinity) {
    await Model.updateMany(
      {
        owner: ownerId,
        isActive: false,
        deactivationReason: "subscription",
      },
      {
        $set: {
          isActive: true,
          deactivationReason: null,
        },
      },
    );

    return;
  }

  // Get currently active resources
  const activeResources = resources.filter(
    (resource) => resource.isActive,
  );

  // If there are more active resources than the plan allows,
  // deactivate the oldest resources above the limit.
  if (activeResources.length > limit) {
    const resourcesToDeactivate =
      activeResources.slice(limit);

    await Model.updateMany(
      {
        _id: {
          $in: resourcesToDeactivate.map(
            (resource) => resource._id,
          ),
        },
      },
      {
        $set: {
          isActive: false,
          deactivationReason: "subscription",
        },
      },
    );
  }

  // Calculate how many additional resources can now be active.
  const currentActiveCount = Math.min(
    activeResources.length,
    limit,
  );

  const availableSlots =
    limit - currentActiveCount;

  if (availableSlots <= 0) {
    return;
  }

  // Only automatically reactivate resources that were
  // deactivated by the subscription system.
  const subscriptionInactiveResources =
    resources.filter(
      (resource) =>
        !resource.isActive &&
        resource.deactivationReason === "subscription",
    );

  const resourcesToReactivate =
    subscriptionInactiveResources.slice(
      0,
      availableSlots,
    );

  if (resourcesToReactivate.length > 0) {
    await Model.updateMany(
      {
        _id: {
          $in: resourcesToReactivate.map(
            (resource) => resource._id,
          ),
        },
      },
      {
        $set: {
          isActive: true,
          deactivationReason: null,
        },
      },
    );
  }
};

// Synchronize owner's resources with their subscription plan
const syncOwnerResourcesWithPlan = async (
  ownerId,
  plan,
) => {
  const planLimits = PLAN_LIMITS[plan];

  if (!planLimits) {
    throw new Error(
      `Invalid subscription plan: ${plan}`,
    );
  }

  await syncResourceLimit(
    Product,
    ownerId,
    planLimits.maxProducts,
  );

  await syncResourceLimit(
    Employee,
    ownerId,
    planLimits.maxEmployees,
  );
};

module.exports = {
  syncOwnerResourcesWithPlan,
};