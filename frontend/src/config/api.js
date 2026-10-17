import axios from "axios";

// Getting the base URL
const getBaseUrl = () => {
  // Use Vercel's same-origin proxy in production so Safari treats auth cookies
  // as first-party instead of blocking cookies sent to the cross-site API host.
  if (!import.meta.env.DEV) {
    return "/api";
  }

  return import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
};

// Function to build API endpoints
const api = (path) => {
  const base = getBaseUrl();
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`;
};

// Auth endpoint
export const AUTH_ENDPOINT = {
  LOGIN_STATUS: api("loginStatus/status"),
};

// Cart endpoints
export const CART_ENDPOINTS = {
  GET_CART: api("cart/getCart"),
  ADD_TO_CART: api("cart/addToCart"),
  UPDATE_CART_ITEM: (productId) => api(`cart/updateCartItem/${productId}`),
  REMOVE_CART_ITEM: (productId) => api(`cart/removeCartItem/${productId}`),
  CLEAR_CART: api("cart/clearCart"),
};

// Category endpoints
export const CATEGORY_ENDPOINTS = {
  CREATE_CATEGORY: api("category/createCategory"),
  GET_ALL_CATEGORY: api("category/getAllCategories"),
  GET_SINGLE_CATEGORY: (id) => api(`category/getAcategory/${id}`),
  UPDATE_CATEGORY: (id) => api(`category/updateCategory/${id}`),
  TOGGLE_CATEGORY_STATUS: (id) => api(`category/toggleCategoryStatus/${id}`),
};

// Employee endpoints
export const EMPLOYEE_ENDPOINTS = {
  CREATE_EMPLOYEE: api("employee/createEmployee"),
  LOGIN_EMPLOYEE: api("employee/loginEmployee"),
  LOGOUT_EMPLOYEE: api("employee/logOutEmployee"),
  GET_ALL_EMPLOYEE: api("employee/getAllEmployees"),
  GET_SINGLE_EMPLOYEE: (id) => api(`employee/getAnEmployee/${id}`),
  UPDATE_EMPLOYEE: (id) => api(`employee/updateEmployee/${id}`),
  TOGGLE_EMPLOYEE_STATUS: (id) => api(`employee/toggleEmployeeStatus/${id}`),
};

// Inventory endpoints
export const INVENTORY_ENDPOINTS = {
  ADD_STOCK: (productId) => api(`inventory/addStock/${productId}`),
  REMOVE_STOCK: (productId) => api(`inventory/removeStock/${productId}`),
  UPDATE_STOCK: (productId) => api(`inventory/updateStock/${productId}`),
  GET_INVENTORY_HISTORY: api("inventory/getInventoryHistory"),
};

// Owner endpoints
export const OWNER_ENDPOINTS = {
  REGISTER_OWNER: api("owner/registerOwner"),
  LOGIN_OWNER: api("owner/loginOwner"),
  LOGOUT_OWNER: api("owner/logoutOwner"),
  GET_OWNER_PROFILE: api("owner/getOwnerProfile"),
  UPDATE_OWNER_PROFILE: api("owner/updateOwnerProfile"),
  CHANGE_EMAIL: api("owner/changeEmail"),
  CHANGE_PASSWORD: api("owner/changePassword"),
};

// Products endpoints
export const PRODUCTS_ENDPOINTS = {
  CREATE_PRODUCTS: api("products/createProduct"),
  GET_ALL_PRODUCTS: api("products/getAllProducts"),
  GET_CASHIER_PRODUCTS: api("products/getCashierProducts"),
  GET_SINGLE_PRODUCT: (id) => api(`products/getSingleProduct/${id}`),
  UPDATE_PRODUCT: (id) => api(`products/updateProduct/${id}`),
  TOGGLE_PRODUCT_STATUS: (id) => api(`products/toggleProductStatus/${id}`),
  LOW_STOCK: api("products/lowStock"),
  OUT_OF_STOCK: api("products/outOfStock"),
};

// Reports endpoints
export const REPORTS_ENDPOINTS = {
  DASHBOARD: api("reports/dashBoard"),
  EMPLOYEE_DAILY_SALES: (employeeId) => api(`reports/employeeDailySales/${employeeId}`),
  TODAY_SALES:  api("reports/todaySales"),
  WEEKLY_SALES: api("reports/weeklySales"),
  MONTHLY_SALES: api("reports/monthlySales"),
  BEST_SELLING: api("reports/bestSelling"),
  LEAST_SELLING: api("reports/leastSelling"),
};

// Sales endpoints
export const SALES_ENDPOINTS = {
  CREATE_SALE: api("sales/createSale"),
  GET_ALL_SALES: api("sales/getSales"),
  GET_SINGLE_SALE: (saleNumber) => api(`sales/getSingleSale/${saleNumber}`),
};

// Subscription endpoints
export const SUBSCRIPTION_ENDPOINTS = {
  GET_CURRENT_SUBSCRIPTION: api("subscription"),
  CHECK_SUBSCRIPTION_FEATURE: (feature) => api(`subscription/check/${feature}`),
  CANCEL_CURRENT_SUBSCRIPTION: api("subscription/cancel")
}

// Payment endpoints
export const PAYMENT_ENDPOINTS = {
  INITIALIZE_PAYMENT: api("payments/initialize"),
  VERIFY_PAYMENT: (reference) => api(`payments/verify/${reference}`),
  GET_PAYMENT: (reference) => api(`payments/${reference}`)
}

// API configuration for axios requests
export const API_CONFIG = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

export const apiClient = axios.create(API_CONFIG);

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      if (
        window.location.pathname !== "/" &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// Function to make api requests
export const apiRequest = async (url, options = {}) => {
  const { method = "GET", body, headers, ...rest } = options;

  const isFormData = body instanceof FormData;

  const config = {
    url,
    method,
    headers: {
      ...API_CONFIG.headers,
      ...headers,
      ...(isFormData ? { "Content-Type": undefined } : {}),
    },
    ...rest,
  };

  if (body !== undefined) {
    config.data = typeof body === "string" ? JSON.parse(body) : body;
  }

  try {
    const response = await apiClient.request(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message =
          error.response.data?.message ||
          `HTTP error! status: ${error.response.status}`;

        throw new Error(message);
      }

      if (error.request) {
        throw new Error(
          "Unable to connect to the server. Please make sure that the backend server is running on the required port.",
        );
      }
    }

    throw error;
  }
};
