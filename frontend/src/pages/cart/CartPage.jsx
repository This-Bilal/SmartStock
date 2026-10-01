import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../services/cartService";
import { createSale } from "../../services/saleService";
import CartItem from "./components/CartItem";
import SaleSuccessModal from "../sales/components/SaleSuccesModal";
import { toast, Toaster } from "sonner";

const CartPage = () => {
  useTitle("SmartStock: cart");

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cartActionLoading, setCartActionLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [saleLoading, setSaleLoading] = useState(false);

  // Stores the completed sale for the success modal
  const [completedSale, setCompletedSale] = useState(null);

  // HANDLE SUCCESS MESSAGE
  const handleSuccess = (message) => {
    toast.success(message);
  };

  // HANDLE ERROR MESSAGE
  const handleError = (message) => {
    toast.error(message);
  };

  // FETCH CART
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);

        const data = await getCart();
        setCart(data);
      } catch (error) {
        handleError(error?.message || "Unable to load cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // UPDATE CART ITEM QUANTITY
  const handleQuantityChange = async (item, quantity) => {
    if (quantity < 1) return;

    try {
      setCartActionLoading(true);

      const updatedCart = await updateCartItem(item.productId, quantity);

      setCart(updatedCart);
    } catch (error) {
      handleError(error?.message || "Failed to update item quantity.");
    } finally {
      setCartActionLoading(false);
    }
  };

  // REMOVE CART ITEM
  const handleRemoveItem = async (item) => {
    try {
      setCartActionLoading(true);

      const updatedCart = await removeCartItem(item.productId);

      setCart(updatedCart);

      handleSuccess("Product removed from cart.");
    } catch (error) {
      handleError(error?.message || "Failed to remove product from cart.");
    } finally {
      setCartActionLoading(false);
    }
  };

  // CLEAR CART
  const handleClearCart = async () => {
    try {
      setCartActionLoading(true);

      const updatedCart = await clearCart();

      setCart(updatedCart);

      handleSuccess("Cart cleared successfully.");
    } catch (error) {
      handleError(error?.message || "Failed to clear cart.");
    } finally {
      setCartActionLoading(false);
    }
  };

  // COMPLETE SALE
  const handleCompleteSale = async () => {
    try {
      setSaleLoading(true);

      const sale = await createSale(paymentMethod);

      // Store completed sale so the modal can display its details
      setCompletedSale(sale);

      // Backend has already cleared the cart
      setCart((currentCart) => ({
        ...currentCart,
        items: [],
        totalAmount: 0,
      }));

      handleSuccess("Sale completed successfully.");
    } catch (error) {
      handleError(error?.message || "Failed to complete sale.");
    } finally {
      setSaleLoading(false);
    }
  };

  // TOTAL AMOUNT
  const totalAmount =
    cart?.items?.reduce((total, item) => total + (item.subtotal || 0), 0) || 0;

  // TOTAL QUANTITY
  const totalItems =
    cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  return (
    <main className="min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* BACK BUTTON */}
        <div className="mb-5 sm:mb-6">
          <BackButton />
        </div>

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
            Cart
          </h1>

          <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
            Review the items and complete the sale.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 py-10 shadow-md sm:p-5 lg:p-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Loading cart...
            </p>
          </div>
        )}

        {/* EMPTY CART */}
        {!loading && (!cart?.items || cart.items.length === 0) && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-10 text-center shadow-sm">
            <div className="mb-4 text-5xl">🛒</div>

            <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
              Your cart is empty
            </h2>

            <p className="mt-1 max-w-sm text-xs text-gray-500 sm:text-sm">
              Add products to the cart before creating a sale.
            </p>

            <Link
              to="/cashierProductList"
              className="mt-5 rounded-lg bg-red-500 px-5 py-2.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-red-600 sm:text-sm"
            >
              Add Products
            </Link>
          </div>
        )}

        {/* CART CONTENT */}
        {!loading && cart?.items?.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            {/* CART ITEMS */}
            <section className="min-w-0 rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* CART HEADER */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-5">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800 sm:text-base">
                    Cart Items
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {totalItems} item
                    {totalItems !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleClearCart}
                    disabled={cartActionLoading || saleLoading}
                    className="text-xs font-medium text-red-400 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                  >
                    Clear cart
                  </button>

                  <Link
                    to="/cashierProductList"
                    className="text-xs font-medium text-red-500 transition-colors hover:text-red-600 sm:text-sm"
                  >
                    + Add products
                  </Link>
                </div>
              </div>

              {/* CART ITEMS */}
              <div className="divide-y divide-gray-100">
                {cart.items.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    loading={cartActionLoading || saleLoading}
                  />
                ))}
              </div>
            </section>

            {/* SALE SUMMARY */}
            <aside className="h-fit rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* SUMMARY HEADER */}
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-gray-800 sm:text-base">
                  Sale Summary
                </h2>
              </div>

              <div className="p-5">
                {/* AMOUNT SUMMARY */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 sm:text-sm">
                    <span>Items</span>
                    <span>{totalItems}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 sm:text-sm">
                    <span>Subtotal</span>
                    <span>₦{totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800 sm:text-base">
                        Total
                      </span>

                      <span className="text-lg font-bold text-gray-800">
                        ₦{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PAYMENT METHOD */}
                <div className="mt-6">
                  <label
                    htmlFor="paymentMethod"
                    className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm"
                  >
                    Payment Method
                  </label>

                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={saleLoading}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>

                {/* COMPLETE SALE */}
                <button
                  type="button"
                  onClick={handleCompleteSale}
                  disabled={saleLoading || cartActionLoading}
                  className="mt-5 w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saleLoading ? "Completing Sale..." : "Complete Sale"}
                </button>

                {/* CONTINUE SHOPPING */}
                <Link
                  to="/cashierProductList"
                  className="mt-3 block text-center text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 sm:text-sm"
                >
                  Continue shopping
                </Link>
              </div>
            </aside>
          </div>
        )}

        {/* SALE SUCCESS MODAL */}
        {completedSale && (
          <SaleSuccessModal
            sale={completedSale}
            onClose={() => setCompletedSale(null)}
          />
        )}
      </div>

      <Toaster position="top-right" richColors />
    </main>
  );
};

export default CartPage;
