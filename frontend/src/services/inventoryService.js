import { apiRequest, INVENTORY_ENDPOINTS } from "../config/api";

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-NG", {
    timeZone: "Africa/Lagos",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("en-NG", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const transformData = (data) => ({
  id: data?._id,
  productName: data?.product?.name,
  movementType: data?.movementType,
  quantity: data?.quantity,
  previousStock: data?.previousStock,
  currentStock: data?.currentStock,
  reason: data?.reason,
  employeeName: data?.employee?.name,
  employeeRole: data?.employee?.role,
  time: formatTime(data?.createdAt),
  date: formatDate(data?.createdAt),
});

const transformHistory = (data) => ({
  id: data?._id,
  productName: data?.product?.name,
  productSku: data?.product?.sku,
  movementType: data?.movementType,
  quantity: data?.quantity,
  previousStock: data?.previousStock,
  currentStock: data?.currentStock,
  reason: data?.reason,
  employeeName: data?.employee?.name,
  employeeRole: data?.employee?.role,
  saleNumber: data?.sale?.saleNumber,
  date: data?.createdAt,
});

// Add stock
export const addStock = async (productId, productDetails) => {
  const { quantity, reason } = productDetails;

  if (!productId) {
    throw new Error("Invalid product ID.");
  }

  if (!quantity || quantity <= 0 || !reason?.trim()) {
    throw new Error("Quantity and reason for this is needed.");
  }

  try {
    const response = await apiRequest(
      INVENTORY_ENDPOINTS.ADD_STOCK(productId),
      {
        method: "POST",
        body: {
          quantity,
          reason: reason.trim(),
        },
      },
    );

    const transformedData = transformData(response);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to add stock.");
  }
};

// Remove stock
export const removeStock = async (productId, productDetails) => {
  const { quantity, reason } = productDetails;

  if (!productId) {
    throw new Error("Invalid product ID.");
  }

  if (!quantity || quantity <= 0 || !reason?.trim()) {
    throw new Error("Quantity and reason for this is needed.");
  }

  try {
    const response = await apiRequest(
      INVENTORY_ENDPOINTS.REMOVE_STOCK(productId),
      {
        method: "PATCH",
        body: {
          quantity,
          reason: reason.trim(),
        },
      },
    );

    const transformedData = transformHistory(response);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to remove stock.");
  }
};

// Update stock
export const updateStock = async (productId, productDetails) => {
  const { movementType, quantity, reason } = productDetails;

  if (!productId) {
    throw new Error("Invalid product ID.");
  }

  if (!quantity || quantity <= 0) {
    throw new Error("Quantity has to be greater than zero.");
  }

  if (!reason?.trim()) {
    throw new Error("Reason for movement has to be indicated.");
  }

  if (!["stock_in", "stock_out"].includes(movementType)) {
    throw new Error("Invalid movement type.");
  }

  try {
    const response = await apiRequest(
      INVENTORY_ENDPOINTS.UPDATE_STOCK(productId),
      {
        method: "PATCH",
        body: {
          movementType,
          quantity,
          reason: reason.trim(),
        },
      },
    );

    const transformedData = transformData(response);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to update stock.");
  }
};

// Get inventory history
export const getInventoryHistory = async () => {
  try {
    const response = await apiRequest(
      INVENTORY_ENDPOINTS.GET_INVENTORY_HISTORY,
    );

    const transformedData = response.map(transformHistory);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get inventory history.");
  }
};

const inventoryService = {
  addStock,
  removeStock,
  updateStock,
  getInventoryHistory,
};

export default inventoryService;
