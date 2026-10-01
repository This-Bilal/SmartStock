import { apiRequest, SALES_ENDPOINTS } from "../config/api";

const transformData = (data) => ({
  id: data?._id,
  saleNumber: data?.saleNumber,
  employeeName: data?.employee?.name,
  employeeRole: data?.employee?.role,
  items: (data?.items ?? []).map((item) => ({
    id: item?.product._id ?? item?.product,
    productName: item?.productName,
    sku: item?.sku,
    quantity: item?.quantity,
    unitPrice: item?.unitPrice,
    subtotal: item?.subtotal,
  })),
  totalAmount: data?.totalAmount,
  paymentMethod: data?.paymentMethod,
  paymentStatus: data?.paymentStatus,
  status: data?.status,
  date: data?.createdAt,
});

// Create sale
export const createSale = async (paymentMethod) => {
  try {
    const response = await apiRequest(SALES_ENDPOINTS.CREATE_SALE, {
      method: "POST",
      body: {
        paymentMethod,
      },
    });

    const transformedData = transformData(response);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to create sale.");
  }
};

// Get sales
export const getSales = async () => {
  try {
    const response = await apiRequest(SALES_ENDPOINTS.GET_ALL_SALES);

    const transformedData = response.map(transformData);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get sales.");
  }
};

// Get a single sale
export const getSingleSale = async (saleNo) => {
  if (!saleNo) {
    throw new Error("Invalid sale number.");
  }

  try {
    const response = await apiRequest(SALES_ENDPOINTS.GET_SINGLE_SALE(saleNo));

    const transformedData = transformData(response);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get sale.");
  }
};

const saleService = {
  createSale,
  getSales,
  getSingleSale,
};

export default saleService;
