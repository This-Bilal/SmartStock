import React from "react";
import { Link } from "react-router-dom";

const CashierQuickAction = () => {
  return (
    <div className="w-full rounded-xl bg-white p-3 shadow-md sm:p-4 md:p-5">
      {/* HEADER */}
      <h2 className="mb-4 text-lg font-bold text-gray-800 sm:mb-5 sm:text-xl">
        Quick Actions
      </h2>

      {/* ACTIONS */}
      <div className="flex flex-col gap-2 sm:gap-3">
        {/* NEW SALE */}
        <Link
          to="/cashierProductList"
          className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 transition-all duration-200 hover:bg-blue-50 sm:gap-3 sm:p-4"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base sm:h-10 sm:w-10 sm:text-xl">
            🛒
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 sm:text-base">
              New Sale
            </p>

            <p className="text-xs text-gray-500 sm:text-sm">
              Start a new customer sale
            </p>
          </div>
        </Link>

        {/* SALES HISTORY */}
        <Link
          to="/cashierSalesPage"
          className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 transition-all duration-200 hover:bg-red-50 sm:gap-3 sm:p-4"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-base sm:h-10 sm:w-10 sm:text-xl">
            💰
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 sm:text-base">
              Sales History
            </p>

            <p className="text-xs text-gray-500 sm:text-sm">
              View and track previous sales of yours
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CashierQuickAction;
