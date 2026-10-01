import { apiRequest, REPORTS_ENDPOINTS } from "../config/api";

const transformToday = (data) => ({
  totalSales: data?.totalSales,
  totalRevenue: data?.totalRevenue,
  date: data?.date,
  sales: (data?.sales ?? []).map((sale) => ({
    id: sale?._id,
    saleNumber: sale?.saleNumber,
    employeeName: sale?.employee?.name,
    employeeEmail: sale?.employee?.email,
    items: (sale?.items ?? []).map((item) => ({
      id: item?.product,
      productName: item?.productName,
      sku: item?.sku,
      quantity: item?.quantity,
      unitPrice: item?.unitPrice,
      costPrice: item?.costPrice,
      subtotal: item?.subtotal,
    })),
    totalAmount: sale?.totalAmount,
    paymentMethod: sale?.paymentMethod,
    paymentStatus: sale?.paymentStatus,
    status: sale?.status,
    date: sale?.createdAt,
  })),
});

const transformWeek = (data) => ({
  totalSales: data?.totalSales,
  totalRevenue: data?.totalRevenue,
  weekStart: data?.weekStart,
  weekEnd: data?.weekEnd,
  sales: (data?.sales ?? []).map((sale) => ({
    id: sale?._id,
    saleNumber: sale?.saleNumber,
    employeeName: sale?.employee?.name,
    employeeEmail: sale?.employee?.email,
    items: (sale?.items ?? []).map((item) => ({
      id: item?.product,
      productName: item?.productName,
      sku: item?.sku,
      quantity: item?.quantity,
      unitPrice: item?.unitPrice,
      costPrice: item?.costPrice,
      subtotal: item?.subtotal,
    })),
    totalAmount: sale?.totalAmount,
    paymentMethod: sale?.paymentMethod,
    paymentStatus: sale?.paymentStatus,
    status: sale?.status,
    date: sale?.createdAt,
  })),
});

const transformMonth = (data) => ({
  totalSales: data?.totalSales,
  totalRevenue: data?.totalRevenue,
  month: data?.month,
  monthStart: data?.monthStart,
  monthEnd: data?.monthEnd,
  sales: (data?.sales ?? []).map((sale) => ({
    id: sale?._id,
    saleNumber: sale?.saleNumber,
    employeeName: sale?.employee?.name,
    employeeEmail: sale?.employee?.email,
    items: (sale?.items ?? []).map((item) => ({
      id: item?.product,
      productName: item?.productName,
      sku: item?.sku,
      quantity: item?.quantity,
      unitPrice: item?.unitPrice,
      costPrice: item?.costPrice,
      subtotal: item?.subtotal,
    })),
    totalAmount: sale?.totalAmount,
    paymentMethod: sale?.paymentMethod,
    paymentStatus: sale?.paymentStatus,
    status: sale?.status,
    date: sale?.createdAt,
  })),
});

const transformEmployeeDailySales = (data) => ({
  totalSales: data?.totalSales,
  totalRevenue: data?.totalRevenue,
  date: data?.date,
  sales: (data?.sales ?? []).map((sale) => ({
    id: sale?._id,
    saleNumber: sale?.saleNumber,
    employeeName: sale?.employee?.name,
    employeeEmail: sale?.employee?.email,
    employeeRole: sale?.employee?.role,
    items: (sale?.items ?? []).map((item) => ({
      id: item?.product,
      productName: item?.productName,
      sku: item?.sku,
      quantity: item?.quantity,
      unitPrice: item?.unitPrice,
      costPrice: item?.costPrice,
      subtotal: item?.subtotal,
    })),
    totalAmount: sale?.totalAmount,
    paymentMethod: sale?.paymentMethod,
    paymentStatus: sale?.paymentStatus,
    status: sale?.status,
    date: sale?.createdAt,
  })),
});

const transformData = (data) => ({
  id: data?._id,
  productName: data?.productName,
  sku: data?.sku,
  totalQuantitySold: data?.totalQuantitySold,
  totalRevenue: data?.totalRevenue,
});

// Get dashboard
export const getDashboard = async () => {
  try {
    const response = await apiRequest(REPORTS_ENDPOINTS.DASHBOARD);

    return response;
  } catch (error) {
    throw new Error(error?.message || "Failed to get dashboard.");
  }
};

// Today sales
export const getTodaySales = async () => {
  try {
    const response = await apiRequest(REPORTS_ENDPOINTS.TODAY_SALES);

    const transformedData = transformToday(response);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get sales.");
  }
};

// Employee daily sales
export const getEmployeeDailySales = async (employeeId) => {
  try {
    const response = await apiRequest(
      REPORTS_ENDPOINTS.EMPLOYEE_DAILY_SALES(employeeId),
    );

    const transformedData = transformEmployeeDailySales(response);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get employee daily sales.");
  }
};

// Weekly sales
export const getWeeklySales = async () => {
  try {
    const response = await apiRequest(REPORTS_ENDPOINTS.WEEKLY_SALES);

    const transformedData = transformWeek(response);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get sales.");
  }
};

// Monthly sales
export const getMonthlySales = async () => {
  try {
    const response = await apiRequest(REPORTS_ENDPOINTS.MONTHLY_SALES);

    const transformedData = transformMonth(response);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get sales.");
  }
};

// Best selling
export const getBestSellingProducts = async () => {
  try {
    const response = await apiRequest(REPORTS_ENDPOINTS.BEST_SELLING);

    const transformedData = response.map(transformData);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get products.");
  }
};

// Least selling
export const getLeastSellingProducts = async () => {
  try {
    const response = await apiRequest(REPORTS_ENDPOINTS.LEAST_SELLING);

    const transformedData = response.map(transformData);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get products.");
  }
};

const reportService = {
  getDashboard,
  getTodaySales,
  getEmployeeDailySales,
  getWeeklySales,
  getMonthlySales,
  getBestSellingProducts,
  getLeastSellingProducts,
};

export default reportService;
