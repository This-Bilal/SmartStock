import { apiRequest, CART_ENDPOINTS } from "../config/api";

// Transform cartdata to match the frontend
const transformCart = (cartData) => ({
  id: cartData?._id ?? null,
  items: (cartData?.items ?? []).map((item) => ({
    productId: item?.product,
    productName: item?.productName,
    sku: item?.sku,
    image: item?.image,
    quantity: item?.quantity ?? 0,
    unitPrice: item?.unitPrice ?? 0,
    subtotal: item?.subtotal ?? 0,
  })),
  totalAmount: cartData?.totalAmount ?? 0,
  totalItems: (cartData?.items ?? []).reduce(
    (total, item) => total + (item.quantity ?? 0),
    0,
  ),

  status: cartData?.status ?? "active",
});

// Get cart
export const getCart = async () => {
  try {
    const response = await apiRequest(CART_ENDPOINTS.GET_CART, {
      method: "GET",
    });

    return transformCart(response.cart);
  } catch (error) {
    throw new Error(error.message || "Failed to get cart");
  }
};

// Add to cart
export const addToCart = async (product, quantity) => {
  if (!product?.id) {
    throw new Error("Invalid product");
  }

  if (!quantity || quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }

  try {
    const response = await apiRequest(CART_ENDPOINTS.ADD_TO_CART, {
      method: "POST",
      body: {
        productId: product.id,
        quantity,
      },
    });

    const transformedCart = transformCart(response);

    return transformedCart;
  } catch (error) {
    throw new Error(error?.message || error?.message || "Failed to add item.");
  }
};

// Update cart item
export const updateCartItem = async (productId, quantity) => {
  if (!productId) {
    throw new Error("Invalid product");
  }

  if (!quantity || quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  try {
    const response = await apiRequest(
      CART_ENDPOINTS.UPDATE_CART_ITEM(productId),
      {
        method: "PATCH",
        body: { quantity },
      },
    );

    const transformedCart = transformCart(response);
    return transformedCart;
  } catch (error) {
    throw new Error(error?.message || "Failed to update item.");
  }
};

// Remove cart item
export const removeCartItem = async (productId) => {
  if (!productId) {
    throw new Error("Invalid product");
  }

  try {
    const response = await apiRequest(
      CART_ENDPOINTS.REMOVE_CART_ITEM(productId),
      {
        method: "DELETE",
      },
    );

    const transformedCart = transformCart(response);
    return transformedCart;
  } catch (error) {
    throw new Error(error.message || "Failed to remove item from cart.");
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const response = await apiRequest(CART_ENDPOINTS.CLEAR_CART, {
      method: "DELETE",
    });

    const transformedCart = transformCart(response);
    return transformedCart;
  } catch (error) {
    throw new Error(error?.message || "Failed to clear cart.");
  }
};

const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};

export default cartService;
