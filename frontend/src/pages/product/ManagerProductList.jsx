import React, { useEffect, useRef, useState } from "react";
import { getAllProducts } from "../../services/productService";
import { useTitle } from "../../hooks/useTitile";
import { Link, useNavigate } from "react-router-dom";
import ManagerProductCard from "./component/ManagerProductCard";
import { toast, Toaster } from "sonner";
import { MdArrowBack } from "react-icons/md";

const ManagerProductList = () => {
  useTitle("SmartStock: products");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("active");
  const [loading, setLoading] = useState(true);

  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getAllProducts();

        setProducts(data);
      } catch (error) {
        toast.error(error?.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Clear message timeout when component unmounts
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  // Update product status in the parent state
  const handleProductStatusChange = (updatedProduct) => {
    // Handle either:
    // updatedProduct
    // or { product: updatedProduct }
    const productData = updatedProduct?.product || updatedProduct;

    const productId = productData?.id || productData?._id;

    const newStatus = productData?.isActive;

    if (!productId || typeof newStatus !== "boolean") {
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              isActive: newStatus,
            }
          : product,
      ),
    );

    toast.success(
      newStatus
        ? "Product activated successfully."
        : "Product deactivated successfully.",
    );

    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    messageTimeoutRef.current = setTimeout(() => {}, 2000);
  };

  // Display status operation errors
  const handleProductStatusError = (message) => {
    toast.error(message);

    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    messageTimeoutRef.current = setTimeout(() => {}, 4000);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      product.name?.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query) ||
      product.category?.name?.toLowerCase().includes(query);

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "active"
          ? product.isActive
          : !product.isActive;

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* Back Button */}
        <div className="mb-5 sm:mb-6">
          <button
            onClick={() => navigate("/managerhomepage")}
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors duration-200 hover:text-gray-800 hover:cursor-pointer sm:text-sm"
          >
            <MdArrowBack className="text-base sm:text-lg" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
              Products
            </h1>

            <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
              View and manage your products.
            </p>
          </div>

          {/* Search */}
          <div className="w-full sm:w-72 lg:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category or SKU..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Add Product */}
          <Link
            to="/createProduct"
            className="w-full rounded-lg bg-red-500 px-3 py-2 text-center text-[11px] font-medium text-white transition-all duration-200 hover:bg-red-600 sm:w-auto sm:px-4 sm:py-2.5 sm:text-xs md:text-sm"
          >
            + Add Product
          </Link>
        </div>

        {/* Product Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("active")}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
              filter === "active"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Active
          </button>

          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
              filter === "all"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setFilter("inactive")}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
              filter === "inactive"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Inactive
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 py-10 shadow-md sm:p-5 lg:p-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Loading products...
            </p>
          </div>
        )}

        {/* No Products */}
        {!loading && products.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">No products found.</p>
          </div>
        )}

        {/* No Filter/Search Results */}
        {!loading && products.length > 0 && filteredProducts.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              {search
                ? `No products found for "${search}".`
                : `No ${filter} products found.`}
            </p>
          </div>
        )}

        {/* Products */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ManagerProductCard
                key={product.id}
                product={product}
                onStatusChange={handleProductStatusChange}
                onStatusError={handleProductStatusError}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ManagerProductList;
