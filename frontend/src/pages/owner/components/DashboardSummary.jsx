import React from "react";
import { Link } from "react-router-dom";

const DashboardSummary = ({
  owner,
  products,
  sales,
  report,
  activeEmployees,
}) => {
  return (
    <section className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      {/* GREETING + PROFILE */}
      <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
        {/* GREETING */}
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
            Good day, {owner?.name} 👋
          </h1>

          <p className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-sm lg:text-base">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* OWNER PROFILE */}
        <Link
          to="/ownerprofile"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-lg shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md sm:h-11 sm:w-11 sm:text-xl"
          title="View profile"
        >
          👤
        </Link>
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

        {/* SALES */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-200 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Sales
              </p>

              <p className="mt-1.5 text-xl font-bold text-gray-800 sm:mt-2 sm:text-2xl">
                {sales?.totalSales || 0}
              </p>

              <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                Sales today
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-lg sm:h-11 sm:w-11 sm:text-xl">
              💰
            </div>
          </div>
        </div>

        {/* REVENUE */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-200 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Revenue
              </p>

              <p className="mt-1.5 wrap-break-words text-lg font-bold text-gray-800 sm:mt-2 sm:text-2xl">
                ₦{report?.totalRevenue?.toLocaleString() || 0}
              </p>

              <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                Revenue today
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-lg sm:h-11 sm:w-11 sm:text-xl">
              📊
            </div>
          </div>
        </div>

        {/* EMPLOYEES */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-200 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Employees
              </p>

              <p className="mt-1.5 text-xl font-bold text-gray-800 sm:mt-2 sm:text-2xl">
                {activeEmployees || 0}
              </p>

              <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                Active employees
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-lg sm:h-11 sm:w-11 sm:text-xl">
              👥
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSummary;
