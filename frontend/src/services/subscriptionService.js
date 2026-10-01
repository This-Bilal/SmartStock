import {
  apiRequest,
  SUBSCRIPTION_ENDPOINTS,
} from "../config/api";

// Transform subscription data
const transformSubscription = (data) => ({
  id: data?.id,
  plan: data?.plan,
  status: data?.status,
  startDate: data?.startDate,
  endDate: data?.endDate,
  limits: data?.limits || {},
});

// Transform plan data
const transformPlan = (data) => ({
  id: data?.id,
  name: data?.name,
  price: data?.price,
  description: data?.description,
  limits: data?.limits || {},
});

// Get current subscription and available plans
export const getCurrentSubscription = async () => {
  try {
    const response = await apiRequest(
      SUBSCRIPTION_ENDPOINTS.GET_CURRENT_SUBSCRIPTION,
    );

    return {
      subscription: transformSubscription(
        response?.subscription,
      ),

      plans: Array.isArray(response?.plans)
        ? response.plans.map(transformPlan)
        : [],
    };
  } catch (error) {
    throw new Error(
      error?.message || "Failed to get current subscription.",
    );
  }
};

// Check subscription feature
export const checkSubscriptionFeature = async (feature) => {
  if (!feature?.trim()) {
    throw new Error("Feature is required.");
  }

  try {
    const response = await apiRequest(
      SUBSCRIPTION_ENDPOINTS.CHECK_SUBSCRIPTION_FEATURE(
        feature.trim(),
      ),
    );

    return response;
  } catch (error) {
    throw new Error(
      error?.message || "Failed to check subscription feature.",
    );
  }
};

// Cancel current subscription
export const cancelCurrentSubscription = async () => {
  try {
    const response = await apiRequest(
      SUBSCRIPTION_ENDPOINTS.CANCEL_CURRENT_SUBSCRIPTION,
      {
        method: "PATCH",
      },
    );

    return response;
  } catch (error) {
    throw new Error(
      error?.message || "Failed to cancel subscription.",
    );
  }
};

const subscriptionService = {
  getCurrentSubscription,
  checkSubscriptionFeature,
  cancelCurrentSubscription,
};

export default subscriptionService;