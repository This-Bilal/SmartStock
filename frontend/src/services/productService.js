import { apiRequest, PRODUCTS_ENDPOINTS } from "../config/api";

const transformData = (data) => ({
  id: data?._id,
  name: data?.name,
  sku: data?.sku,
  category: {
    id: data?.category?.id,
    name: data?.category?.name,
  },
  price: data?.price,
  costPrice: data?.costPrice,
  quantity: data?.quantity,
  lowStockLimit: data?.lowStockLimit,
  image: data?.image,
  isActive: data?.isActive,
});

// Create product
export const createProduct = async (details) => {
  const { name, category, price, costPrice, lowStockLimit, image } = details;

  if (
    !name?.trim() ||
    !category ||
    price == null ||
    costPrice == null ||
    lowStockLimit == null
  ) {
    throw new Error(
      "Name, category, price, cost price and low-stock-limit fields are all required.",
    );
  }

  try {
    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("category", category);
    formData.append("price", price);
    formData.append("costPrice", costPrice);
    formData.append("lowStockLimit", lowStockLimit);

    if (image) {
      formData.append("image", image);
    }

    const response = await apiRequest(PRODUCTS_ENDPOINTS.CREATE_PRODUCTS, {
      method: "POST",
      body: formData,
    });

    const transformedData = transformData(response);

    return transformedData;
  } catch (error) {
    throw new Error(error.message || "Failed to create product.");
  }
};

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await apiRequest(PRODUCTS_ENDPOINTS.GET_ALL_PRODUCTS);

    const transformedData = response.map(transformData);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get products.");
  }
};

// Get all cashier products
export const getCashierProducts = async () => {
  try {
    const response = await apiRequest(PRODUCTS_ENDPOINTS.GET_CASHIER_PRODUCTS);

    const transformedData = response.map(transformData);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get products.");
  }
};

// Get product
export const getProduct = async (productId) => {
  if (!productId) {
    throw new Error("Invalid product ID");
  }

  try {
    const response = await apiRequest(
      PRODUCTS_ENDPOINTS.GET_SINGLE_PRODUCT(productId),
    );

    const transformedData = transformData(response);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get product.");
  }
};

// Update product
export const updateProduct = async (productId, details) => {
  const { name, category, price, costPrice, lowStockLimit, image } = details;

  if (!productId) {
    throw new Error("Invalid product ID");
  }

  const formData = new FormData();

  if (name !== undefined) {
    if (!name?.trim()) {
      throw new Error("Name cannot be left blank");
    }

    formData.append("name", name.trim());
  }

  if (category !== undefined) {
    if (!category) {
      throw new Error("Category cannot be left blank");
    }

    formData.append("category", category);
  }

  if (price !== undefined) {
    if (price === null) {
      throw new Error("Price cannot be left blank");
    }

    formData.append("price", price);
  }

  if (costPrice !== undefined) {
    if (costPrice === null) {
      throw new Error("Cost price cannot be left blank");
    }

    formData.append("costPrice", costPrice);
  }

  if (lowStockLimit !== undefined) {
    if (lowStockLimit === null) {
      throw new Error("Low-stock-limit cannot be left blank");
    }

    if (Number.isNaN(Number(lowStockLimit))) {
      throw new Error("Invalid parameter for low stock limit");
    }

    formData.append("lowStockLimit", lowStockLimit);
  }

  if (image) {
    formData.append("image", image);
  }

  if ([...formData.entries()].length === 0) {
    throw new Error("No changes made.");
  }

  try {
    const response = await apiRequest(
      PRODUCTS_ENDPOINTS.UPDATE_PRODUCT(productId),
      {
        method: "PATCH",
        body: formData,
      },
    );

    const transformedData = transformData(response);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to update product.");
  }
};

// Change product status
export const changeProductStatus = async (productId) => {
  if (!productId) {
    throw new Error("Invalid product ID");
  }

  try {
    const response = await apiRequest(
      PRODUCTS_ENDPOINTS.TOGGLE_PRODUCT_STATUS(productId),
      {
        method: "PATCH",
      },
    );

    const transformedData = transformData(response);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to change product status.");
  }
};

// Low stock products
export const getLowStockProducts = async () => {
  try {
    const response = await apiRequest(PRODUCTS_ENDPOINTS.LOW_STOCK);

    const transformedData = response.map(transformData);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get Low-stock products.");
  }
};

// Out of stock products
export const getOutOfStockProducts = async () => {
  try {
    const response = await apiRequest(PRODUCTS_ENDPOINTS.OUT_OF_STOCK);

    const transformedData = response.map(transformData);

    return transformedData;
  } catch (error) {
    throw new Error(error?.message || "Failed to get out of stock products.");
  }
};

const productService = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  changeProductStatus,
  getLowStockProducts,
  getOutOfStockProducts,
};

export default productService;
