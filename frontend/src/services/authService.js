import { apiRequest, AUTH_ENDPOINT, EMPLOYEE_ENDPOINTS, OWNER_ENDPOINTS } from "../config/api";

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

    const transformedData = transformUser(data);

    storeUser(transformedData);

    return transformedData;
  } catch (error) {
    throw new Error (
      error?.message || {
        message: "Owner registration failed.",
      }
    );
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
    throw new Error (
      error?.message || {
        message: "Owner login failed.",
      }
    );
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
    throw new Error (
      error?.message || {
        message: "Employee login failed.",
      }
    );
  }
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

    throw new Error (
      error?.message || {
        message: "Owner logout failed.",
      }
    );
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

    throw new Error (
      error?.message || {
        message: "Employee logout failed.",
      }
    );
  }
};

export const checkLoginStatus = async () => {
  try {
    const response = await apiRequest(AUTH_ENDPOINT.LOGIN_STATUS, {
      method: "GET"
    })

    return Boolean(response)
  } catch (error) {
    return false
  }
}

const authService = {
  registerOwner,
  loginOwner,
  logoutOwner,
  loginEmployee,
  logoutEmployee,
  checkLoginStatus
};

export default authService;
