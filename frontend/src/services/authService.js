import {
  apiRequest,
  AUTH_ENDPOINT,
  EMPLOYEE_ENDPOINTS,
  OWNER_ENDPOINTS,
} from "../config/api";

// Store user to the localstorage
const storeUser = (user) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem("user", JSON.stringify(user));
};

// Clear user from localstorage
const clearUser = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("user");
};

// Normalising email
const normaliseEmail = (email = "") => email.trim().toLowerCase();

// Transform data to match with the frontend
const transformUser = (userData) => ({
  id: userData?._id,
  name: userData?.name,
  email: userData?.email,
  role: userData?.role,
  businessName: userData?.businessName ?? null,
  isActive: userData?.isActive ?? true,
});

/**
 * Register Owner
 */
export const registerOwner = async (ownerDetails) => {
  const { name, email, businessName, phone, password } = ownerDetails;

  if (!name || !email || !businessName || !phone || !password) {
    throw new Error("All fields are required");
  }

  try {
    const data = await apiRequest(OWNER_ENDPOINTS.REGISTER_OWNER, {
      method: "POST",
      body: {
        name,
        email: normaliseEmail(email),
        businessName,
        phone,
        password,
      },
    });

    return data;
  } catch (error) {
    throw new Error(error?.message || "Owner registration failed.", {
      cause: error,
    });
  }
};

/**
 * Login Owner
 */
export const loginOwner = async (authDetails) => {
  const { email, password } = authDetails;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const data = await apiRequest(OWNER_ENDPOINTS.LOGIN_OWNER, {
      method: "POST",
      body: {
        email: normaliseEmail(email),
        password,
      },
    });

    const transformedData = transformUser(data);
    storeUser(transformedData);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Owner login failed.", {
      cause: error,
    });
  }
};

/**
 * Login Employee (Manager/Cashier)
 */
export const loginEmployee = async (authDetails) => {
  const { email, password } = authDetails;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const data = await apiRequest(EMPLOYEE_ENDPOINTS.LOGIN_EMPLOYEE, {
      method: "POST",
      body: {
        email: normaliseEmail(email),
        password,
      },
    });

    const transformedData = transformUser(data);
    storeUser(transformedData);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Employee login failed.", {
      cause: error,
    });
  }
};

export const verifyEmail = async (accountType, token) => {
  const endpoint =
    accountType === "owner"
      ? OWNER_ENDPOINTS.VERIFY_EMAIL
      : accountType === "employee"
        ? EMPLOYEE_ENDPOINTS.VERIFY_EMAIL
        : null;

  if (!endpoint || !token) {
    throw new Error("Invalid email verification link.");
  }

  const data = await apiRequest(endpoint, {
    method: "POST",
    body: { token },
  });

  if (data.role) {
    storeUser(transformUser(data));
  }

  return data;
};

export const resendEmailVerification = async (accountType, email) => {
  const endpoint =
    accountType === "owner"
      ? OWNER_ENDPOINTS.RESEND_VERIFICATION
      : accountType === "employee"
        ? EMPLOYEE_ENDPOINTS.RESEND_VERIFICATION
        : null;

  if (!endpoint || !email?.trim()) {
    throw new Error("Select an account type and enter your email address.");
  }

  return apiRequest(endpoint, {
    method: "POST",
    body: { email: normaliseEmail(email) },
  });
};

export const requestPasswordReset = async (email, accountType) => {
  return apiRequest(AUTH_ENDPOINT.FORGOT_PASSWORD, {
    method: "POST",
    body: {
      email: normaliseEmail(email),
      accountType,
    },
  });
};

export const resetPassword = async (token, password) => {
  return apiRequest(AUTH_ENDPOINT.RESET_PASSWORD, {
    method: "POST",
    body: { token, password },
  });
};

/**
 * Logout Owner
 */
export const logoutOwner = async () => {
  try {
    await apiRequest(OWNER_ENDPOINTS.LOGOUT_OWNER, {
      method: "POST"
    });

    clearUser();

    return true;
  } catch (error) {
    clearUser();

    throw new Error(error?.message || "Owner logout failed.", {
      cause: error,
    });
  }
};

/**
 * Logout Employee
 */
export const logoutEmployee = async () => {
  try {
    await apiRequest(EMPLOYEE_ENDPOINTS.LOGOUT_EMPLOYEE, {
      method: "POST"
    });

    clearUser();

    return true;
  } catch (error) {
    clearUser();

    throw new Error(error?.message || "Employee logout failed.", {
      cause: error,
    });
  }
};

export const checkLoginStatus = async () => {
  try {
    const response = await apiRequest(AUTH_ENDPOINT.LOGIN_STATUS, {
      method: "GET"
    })

    return Boolean(response)
  } catch {
    return false
  }
}

const authService = {
  registerOwner,
  loginOwner,
  logoutOwner,
  loginEmployee,
  verifyEmail,
  resendEmailVerification,
  requestPasswordReset,
  resetPassword,
  logoutEmployee,
  checkLoginStatus
};

export default authService;
