import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCashierProducts } from "../../services/productService";
import { addToCart, getCart } from "../../services/cartService";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";
import CashierProductCard from "./component/CashierProductCard";
import { toast, Toaster } from "sonner";
import { MdArrowBack } from "react-icons/md";

const CashierProductList = () => {
  useTitle("SmartStock: products");

  const navigate = useNavigate()

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [cartLoading, setCartLoading] = useState(false);
  const [cart, setCart] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getCashierProducts();
        setProducts(data);
      } catch (error) {
        toast.error(error?.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getCart();
        setCart(cart);
      } catch (error) {
        toast.error(error?.message || "Failed to load cart.");
      }
    };

    fetchCart();
  }, []);

  // HANDLE SUCCESS MESSAGE
  const handleSuccess = (message) => {
    toast.success(message);
  };

  // HANDLE ERROR MESSAGE
  const handleError = (message) => {
    toast.error(message);
  };

  // ADD PRODUCT TO CART
  const handleAddToCart = async (product, quantity) => {
    try {
      setCartLoading(true);

      await addToCart(product, quantity);

      // Refresh cart after successfully adding an item
      const updatedCart = await getCart();
      setCart(updatedCart);

      handleSuccess("Product added to cart.");

      return true;
    } catch (error) {
      handleError(error?.message || "Failed to add item to cart.");

      return false;
    } finally {
      setCartLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      product.name?.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query) ||
      product.category?.name?.toLowerCase().includes(query);

    return matchesSearch;
  });

  return (
    <main className="relative min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* BACK BUTTON */}
        <div className="mb-5 sm:mb-6">
          <button onClick={() => navigate("/cashierhomepage")}
                className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors duration-200 hover:text-gray-800 hover:cursor-pointer sm:text-sm"
              >
                <MdArrowBack className="text-base sm:text-lg" />
                Back
              </button>
        </div>

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          {/* TITLE */}
          <div>
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
              Products
            </h1>

            <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
              Select a product to add it to the cart.
            </p>
          </div>

          {/* SEARCH + CART */}
          <div className="w-full sm:w-72 lg:w-80">
            {/* SEARCH */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category or SKU..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />

            {/* CART */}
            <div className="mt-3 flex justify-end">
              <Link
                to="/cart"
                title="Proceed to cart"
                className="group flex flex-col items-center text-red-500 transition-all duration-200 hover:text-red-600"
              >
                <span className="relative text-3xl transition-transform duration-200 group-hover:scale-110">
                  🛒
                  <span className="absolute -left-0.5 -top-1 rounded-full bg-red-500 px-1 text-sm text-white">
                    {cart?.items?.length || 0}
                  </span>
                </span>

                <span className="mt-1 text-xs font-medium">
                  Proceed to cart
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 py-10 shadow-md sm:p-5 lg:p-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Loading products...
            </p>
          </div>
        )}

        {/* NO PRODUCTS */}
        {!loading && products.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">No products found.</p>
          </div>
        )}

        {/* NO SEARCH RESULTS */}
        {!loading && products.length > 0 && filteredProducts.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              {search
                ? `No products found for "${search}".`
                : "No products found."}
            </p>
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <CashierProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                loading={cartLoading}
              />
            ))}
          </div>
        )}
      </div>

      <Toaster position="top-right" richColors />
    </main>
  );
};

export default CashierProductList;
