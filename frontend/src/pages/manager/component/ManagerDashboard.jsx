import React from "react";
import { Link } from "react-router-dom";

const ManagerDashboard = ({
  manager,
  products,
  totalStock,
  lowStock,
  outOfStock,
}) => {
  return (
    <section className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      {/* GREETING + PROFILE */}
      <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
        {/* GREETING */}
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
            Good day, {manager?.name} 👋
          </h1>

          <p className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-sm lg:text-base">
            Here's what's happening with the store today.
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {/* PRODUCTS */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-200 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Products
              </p>

              <p className="mt-1.5 text-xl font-bold text-gray-800 sm:mt-2 sm:text-2xl">
                {products?.filter((product) => product.isActive).length || 0}
              </p>

              <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                Total products
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-lg sm:h-11 sm:w-11 sm:text-xl">
              📦
            </div>
          </div>
        </div>

        {/* TOTAL STOCK */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-200 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Total Stock
              </p>

              <p className="mt-1.5 text-xl font-bold text-gray-800 sm:mt-2 sm:text-2xl">
                {totalStock?.toLocaleString() || 0}
              </p>

              <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                Units in stock
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-lg sm:h-11 sm:w-11 sm:text-xl">
              📊
            </div>
          </div>
        </div>

        {/* LOW STOCK */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-200 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Low Stock
              </p>

              <p className="mt-1.5 text-xl font-bold text-gray-800 sm:mt-2 sm:text-2xl">
                {lowStock?.filter((product) => product.isActive).length || 0}
              </p>

              <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                Needs attention
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-lg sm:h-11 sm:w-11 sm:text-xl">
              ⚠️
            </div>
          </div>
        </div>

        {/* OUT OF STOCK */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-200 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Out of Stock
              </p>

              <p className="mt-1.5 text-xl font-bold text-gray-800 sm:mt-2 sm:text-2xl">
                {outOfStock?.filter((product) => product.isActive).length || 0}
              </p>

              <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                Currently unavailable
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-lg sm:h-11 sm:w-11 sm:text-xl">
              ❌
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagerDashboard;
