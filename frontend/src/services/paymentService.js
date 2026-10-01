import { apiRequest, PAYMENT_ENDPOINTS } from "../config/api";

// Initialize subscription payment
export const initializePayment = async (plan) => {
  if (!plan?.trim()) {
    throw new Error("Subscription plan is required.");
  }

  if (!["basic", "pro"].includes(plan)) {
    throw new Error("Invalid subscription plan.");
  }

  try {
    const response = await apiRequest(PAYMENT_ENDPOINTS.INITIALIZE_PAYMENT, {
      method: "POST",
      body: {
        plan,
      },
    });

    return response;
  } catch (error) {
    throw new Error(error?.message || "Failed to initialize payment.");
  }
};

// Verify subscription payment
export const verifyPayment = async (reference) => {
  if (!reference?.trim()) {
    throw new Error("Payment reference is required.");
  }

  try {
    const response = await apiRequest(
      PAYMENT_ENDPOINTS.VERIFY_PAYMENT(reference),
    );

    return response;
  } catch (error) {
    throw new Error(error?.message || "Failed to verify payment.");
  }
};

export const getPaymentByReference = async (reference) => {
  if (!reference?.trim()) {
    throw new Error("Payment reference is required.");
  }

  try {
    const response = await apiRequest(
      PAYMENT_ENDPOINTS.GET_PAYMENT_BY_REFERENCE(
        reference.trim(),
      ),
    );

    return response;
  } catch (error) {
    throw new Error(
      error?.message ||
        "Failed to get payment status.",
    );
  }
};

const paymentService = {
  initializePayment,
  verifyPayment,
  getPaymentByReference
};

export default paymentService;
