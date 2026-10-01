import React from "react";
import { Link } from "react-router-dom";

const InventoryOverview = ({ products = [] }) => {
  const totalProducts =
    products.filter((product) => product.isActive).length || 0;

  const totalStock = products.reduce(
    (total, product) =>
      product?.isActive ? total + (product?.quantity || 0) : total,
    0,
  );

  const lowStockProducts = products.filter(
    (product) =>
      (product.quantity ?? 0) > 0 &&
      (product.quantity ?? 0) <= (product.lowStockLimit ?? 5) &&
      product.isActive,
  );

  const outOfStockProducts = products.filter(
    (product) => (product.quantity ?? 0) === 0 && product.isActive,
  );

  const categoryCounts = products
    .filter((product) => product?.isActive)
    .reduce((acc, product) => {
      const category = product?.category?.name || "Uncategorized";

      acc[category] = (acc[category] || 0) + 1;

      return acc;
    }, {});

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <section className="w-full rounded-2xl bg-white p-4 shadow-sm transition-all duration-200 sm:p-5 md:p-6">
      {/* Header */}
      <div id="stock" className="mb-5 sm:mb-6">
        <h2 className="text-base font-semibold text-gray-800 sm:text-lg md:text-xl">
          Inventory Overview
        </h2>

        <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
          Monitor your inventory health and stock levels.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4 lg:grid-cols-4">
        {/* Total Products */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
          <p className="text-xs text-gray-500 sm:text-sm">Products</p>

          <h3 className="mt-1.5 text-lg font-bold text-gray-800 sm:mt-2 sm:text-xl md:text-2xl">
            {totalProducts}
          </h3>
        </div>

        {/* Total Stock */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
          <p className="text-xs text-gray-500 sm:text-sm">Items in Stock</p>

          <h3 className="mt-1.5 text-lg font-bold text-gray-800 sm:mt-2 sm:text-xl md:text-2xl">
            {totalStock.toLocaleString()}
          </h3>
        </div>

        {/* Low Stock */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
          <p className="text-xs text-gray-500 sm:text-sm">Low Stock</p>

          <h3 className="mt-1.5 text-lg font-bold text-yellow-600 sm:mt-2 sm:text-xl md:text-2xl">
            {lowStockProducts.length}
          </h3>
        </div>

        {/* Out of Stock */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
          <p className="text-xs text-gray-500 sm:text-sm">Out of Stock</p>

          <h3 className="mt-1.5 text-lg font-bold text-red-600 sm:mt-2 sm:text-xl md:text-2xl">
            {outOfStockProducts.length}
          </h3>
        </div>
      </div>

      {/* Inventory Details */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        {/* Low Stock Products */}
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <div className="border-b border-gray-100 px-3 py-3 sm:px-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-gray-700 sm:text-sm">
                Low Stock Products
              </h3>

              <span className="shrink-0 rounded-full bg-yellow-50 px-2 py-1 text-[10px] font-medium text-yellow-600 sm:px-2.5 sm:py-1 sm:text-xs">
                {lowStockProducts.length}
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {lowStockProducts.length === 0 ? (
              <p className="p-3 text-xs text-gray-500 sm:p-4 sm:text-sm">
                No low-stock products.
              </p>
            ) : (
              lowStockProducts.slice(0, 4).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 transition hover:bg-gray-50 sm:px-4 sm:py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-800 sm:text-sm">
                      {product.name}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-gray-400 sm:text-xs">
                      {product.sku}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-yellow-50 px-2 py-1 text-[10px] font-medium text-yellow-600 sm:px-3 sm:py-1 sm:text-xs">
                    {product.quantity} left
                  </span>
                </div>
              ))
            )}
          </div>

          {/* View All Low Stock */}
          {lowStockProducts.length > 4 && (
            <div className="border-t border-gray-100 px-3 py-3 sm:px-4">
              <Link
                to="/lowStock"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:px-4 sm:text-sm"
              >
                View All Low Stock Products
              </Link>
            </div>
          )}
        </div>

        {/* Out of Stock Products */}
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <div className="border-b border-gray-100 px-3 py-3 sm:px-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-gray-700 sm:text-sm">
                Out of Stock Products
              </h3>

              <span className="shrink-0 rounded-full bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600 sm:px-2.5 sm:py-1 sm:text-xs">
                {outOfStockProducts.length}
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {outOfStockProducts.length === 0 ? (
              <p className="p-3 text-xs text-gray-500 sm:p-4 sm:text-sm">
                No products are out of stock.
              </p>
            ) : (
              outOfStockProducts.slice(0, 4).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 transition hover:bg-gray-50 sm:px-4 sm:py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-800 sm:text-sm">
                      {product.name}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-gray-400 sm:text-xs">
                      {product.sku}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600 sm:px-3 sm:py-1 sm:text-xs">
                    Out of stock
                  </span>
                </div>
              ))
            )}
          </div>

          {/* View All Out of Stock */}
          {outOfStockProducts.length > 4 && (
            <div className="border-t border-gray-100 px-3 py-3 sm:px-4">
              <Link
                to="/outOfStock"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:px-4 sm:text-sm"
              >
                View All Out of Stock Products
              </Link>
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="overflow-hidden rounded-xl border border-gray-100 lg:col-span-2">
          <div className="border-b border-gray-100 px-3 py-3 sm:px-4">
            <h3 className="text-xs font-semibold text-gray-700 sm:text-sm">
              Top Categories
            </h3>
          </div>

          <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
            {topCategories.length === 0 ? (
              <p className="p-3 text-xs text-gray-500 sm:p-4 sm:text-sm">
                No category data available.
              </p>
            ) : (
              topCategories.map(([category, count]) => (
                <div
                  key={category}
                  className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3"
                >
                  <span className="truncate text-xs text-gray-700 sm:text-sm">
                    {category}
                  </span>

                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600 sm:px-3 sm:py-1 sm:text-xs">
                    {count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventoryOverview;
