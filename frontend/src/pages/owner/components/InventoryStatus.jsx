import React from "react";
import { Link } from "react-router-dom";

const InventoryStatus = ({
  availableProducts = [],
  lowStock = [],
  outOfStock = [],
}) => {
  return (
    <div className="my-auto w-full rounded-2xl bg-white p-4 shadow-md sm:p-5 lg:w-1/3">
      {/* HEADER */}
      <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
        Inventory Status
      </h2>

      <p className="mt-1 text-xs text-gray-500 sm:text-sm">
        Keep track of your current inventory.
      </p>

      {/* INVENTORY STATUS */}
      <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:gap-4">
        {/* IN STOCK */}
        <div className="grid grid-cols-[1fr_35px_50px] items-center gap-2 sm:grid-cols-[1fr_40px_60px] sm:gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="h-3 w-3 shrink-0 rounded-full bg-green-500 sm:h-4 sm:w-4" />

            <p className="truncate text-xs font-medium text-gray-700 sm:text-sm">
              In Stock
            </p>
          </div>

          <span className="text-center text-sm font-semibold text-gray-800 sm:text-base">
            {availableProducts?.filter((product) => product.isActive).length || 0}
          </span>

          <div></div>
        </div>

        {/* LOW STOCK */}
        <div className="grid grid-cols-[1fr_35px_50px] items-center gap-2 sm:grid-cols-[1fr_40px_60px] sm:gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="h-3 w-3 shrink-0 rounded-full bg-yellow-500 sm:h-4 sm:w-4" />

            <p className="truncate text-xs font-medium text-gray-700 sm:text-sm">
              Low Stock
            </p>
          </div>

          <span className="text-center text-sm font-semibold text-gray-800 sm:text-base">
            {lowStock?.filter((product) => product.isActive).length || 0}
          </span>

          <Link
            to="/lowStock"
            className="rounded-lg bg-red-500 px-2 py-1 text-center text-[10px] font-medium text-white transition-colors duration-200 hover:bg-red-600 sm:px-3 sm:text-xs"
          >
            View
          </Link>
        </div>

        {/* OUT OF STOCK */}
        <div className="grid grid-cols-[1fr_35px_50px] items-center gap-2 sm:grid-cols-[1fr_40px_60px] sm:gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="h-3 w-3 shrink-0 rounded-full bg-red-500 sm:h-4 sm:w-4" />

            <p className="truncate text-xs font-medium text-gray-700 sm:text-sm">
              Out Of Stock
            </p>
          </div>

          <span className="text-center text-sm font-semibold text-gray-800 sm:text-base">
            {outOfStock?.filter((product) => product.isActive).length || 0}
          </span>

          <Link
            to="/outOfStock"
            className="rounded-lg bg-red-500 px-2 py-1 text-center text-[10px] font-medium text-white transition-colors duration-200 hover:bg-red-600 sm:px-3 sm:text-xs"
          >
            View
          </Link>
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="mt-6 flex gap-2 border-t border-gray-100 pt-4 sm:mt-7 sm:gap-3 sm:pt-5">
        <Link
          to="/inventoryHistory"
          className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200 sm:px-4 sm:text-sm"
        >
          History
        </Link>

        <Link
          to="/products"
          className="rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition-colors duration-200 hover:bg-red-600 sm:px-4 sm:text-sm"
        >
          Products
        </Link>
      </div>
    </div>
  );
};

export default InventoryStatus;
