import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";
import ProductCard from "./component/ProductCard";

const ProductList = () => {
  useTitle("SmartStock: products");

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        setError(error?.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      product.name?.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query) ||
      product.category.name.toLowerCase().includes(query);

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
          <BackButton />
        </div>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
              Products
            </h1>

            <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
              View and manage your active products.
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
          <div className=" flex flex-col items-center justify-center rounded-2xl py-10 bg-white p-4 shadow-md sm:p-5 lg:p-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Loading products...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 sm:p-5">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* No Products */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">No products found.</p>
          </div>
        )}

        {/* No Filter/Search Results */}
        {!loading &&
          !error &&
          products.length > 0 &&
          filteredProducts.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                {search
                  ? `No products found for "${search}".`
                  : `No ${filter} products found.`}
              </p>
            </div>
          )}

        {/* Products */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductList;
