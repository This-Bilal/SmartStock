import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";

const LowStockProducts = () => {
  useTitle("SmartStock: low stock products");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();

        setProducts(data);
      } catch (error) {
        setError(error?.message || "Failed to load low-stock products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const lowStockProducts = products.filter(
    (product) =>
      (product.quantity ?? 0) > 0 &&
      (product.quantity ?? 0) <= (product.lowStockLimit ?? 5) &&
      product.isActive,
  );

  return (
    <main className="min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 sm:py-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-5">
          <BackButton />
        </div>

        {/* Page Header */}
        <div className="mb-5 sm:mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                Low Stock Products
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                View all products that are currently running low on stock.
              </p>
            </div>

            {!loading && !error && (
              <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-[11px] font-medium text-yellow-600 sm:px-3 sm:text-xs">
                {lowStockProducts.length}{" "}
                {lowStockProducts.length === 1 ? "Product" : "Products"}
              </span>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className=" flex flex-col items-center justify-center rounded-2xl py-10 bg-white p-4 shadow-md sm:p-5 lg:p-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Loading low stock products...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-gray-100 bg-white px-4 py-8 text-center text-xs text-red-500 shadow-sm sm:px-5 sm:py-10 sm:text-sm">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && lowStockProducts.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white px-4 py-8 text-center shadow-sm sm:px-5 sm:py-10">
            <p className="text-xs font-medium text-gray-700 sm:text-sm">
              No low-stock products.
            </p>

            <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
              All products currently have sufficient stock.
            </p>
          </div>
        )}

        {/* Low Stock Products */}
        {!loading && !error && lowStockProducts.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-175 text-left text-xs sm:text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-3 font-semibold text-gray-700 sm:px-4">
                      Product
                    </th>

                    <th className="whitespace-nowrap px-3 py-3 font-semibold text-gray-700 sm:px-4">
                      SKU
                    </th>

                    <th className="whitespace-nowrap px-3 py-3 font-semibold text-gray-700 sm:px-4">
                      Current Stock
                    </th>

                    <th className="whitespace-nowrap px-3 py-3 font-semibold text-gray-700 sm:px-4">
                      Low Stock Limit
                    </th>

                    <th className="whitespace-nowrap px-3 py-3 font-semibold text-gray-700 sm:px-4">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {lowStockProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="transition duration-150 hover:bg-gray-50"
                    >
                      {/* Product */}
                      <td className="px-3 py-3 sm:px-4 sm:py-4">
                        <p className="font-medium text-gray-800">
                          {product.name}
                        </p>

                        <p className="mt-0.5 text-[11px] text-gray-400 sm:mt-1 sm:text-xs">
                          {product.category.name || "Uncategorized"}
                        </p>
                      </td>

                      {/* SKU */}
                      <td className="whitespace-nowrap px-3 py-3 text-gray-600 sm:px-4 sm:py-4">
                        {product.sku}
                      </td>

                      {/* Current Stock */}
                      <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-4">
                        <span className="font-semibold text-yellow-600">
                          {product.quantity}
                        </span>
                      </td>

                      {/* Low Stock Limit */}
                      <td className="whitespace-nowrap px-3 py-3 text-gray-600 sm:px-4 sm:py-4">
                        {product.lowStockLimit ?? 5}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 sm:px-4 sm:py-4">
                        <span className="inline-flex whitespace-nowrap rounded-full bg-yellow-50 px-2.5 py-1 text-[11px] font-medium text-yellow-600 sm:px-3 sm:text-xs">
                          Low Stock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default LowStockProducts;
