import React from "react";
import { Link } from "react-router-dom";

const CashierDashboard = ({
  cashier,
  sales,
  totalSales,
  itemsSold,
}) => {
  return (
    <section className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      {/* GREETING + PROFILE */}
      <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
        {/* GREETING */}
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
            Good day, {cashier?.name} 👋
          </h1>

          <p className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-sm lg:text-base">
            Let's make today a good one.
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className=" mx-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {/* TODAY SALES */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-200 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Today sales
              </p>

              <p className="mt-1.5 text-xl font-bold text-gray-800 sm:mt-2 sm:text-2xl">
                ₦{sales?.totalRevenue.toLocaleString()}
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-lg sm:h-11 sm:w-11 sm:text-xl">
              💰
            </div>
          </div>
        </div>

        {/* TOTAL SALES */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-200 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Total Sales for today
              </p>

              <p className="mt-1.5 text-xl font-bold text-gray-800 sm:mt-2 sm:text-2xl">
                {totalSales}
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-lg sm:h-11 sm:w-11 sm:text-xl">
              📊
            </div>
          </div>
        </div>

        {/* ITEMS SOLD */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-200 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Items sold for today
              </p>

              <p className="mt-1.5 text-xl font-bold text-gray-800 sm:mt-2 sm:text-2xl">
                {itemsSold}
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-lg sm:h-11 sm:w-11 sm:text-xl">
              📦
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CashierDashboard;
