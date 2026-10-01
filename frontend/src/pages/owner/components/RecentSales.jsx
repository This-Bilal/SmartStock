import React from "react";

const RecentSales = ({ sales, loading }) => {
  return (
    <div className="w-full rounded-xl bg-white p-3 shadow-md sm:p-4 md:p-5">
      {/* HEADER */}
      <div className="mb-4 flex flex-col justify-between gap-3 sm:mb-5 sm:flex-row sm:items-center">
        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
          Recent Sales
        </h2>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

          <p className="mt-3 text-xs text-gray-500 sm:text-sm">
            Loading recent sales...
          </p>
        </div>
      ) : sales?.length > 0 ? (
        /* SALES */
        <div className="w-full">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-4 gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm md:gap-4">
            <p>Sale Number</p>
            <p>Employee</p>
            <p>Total Amount</p>
            <p>Status</p>
          </div>

          {/* LATEST 4 SALES */}
          <div className="flex flex-col">
            {sales.slice(0, 4).map((sale) => (
              <div
                key={sale.id}
                className="grid grid-cols-4 items-center gap-2 border-b border-gray-100 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 md:gap-4"
              >
                {/* SALE NUMBER */}
                <p className="truncate text-xs font-medium text-gray-800 sm:text-sm">
                  #{sale.saleNumber}
                </p>

                {/* EMPLOYEE - SECOND COLUMN */}
                <p className="truncate text-xs font-medium text-gray-700 sm:text-sm">
                  {sale.employeeName || "N/A"}
                </p>

                {/* TOTAL AMOUNT - THIRD COLUMN */}
                <p className="text-xs font-semibold text-gray-800 sm:text-sm">
                  ₦{sale.totalAmount?.toLocaleString()}
                </p>

                {/* STATUS - FOURTH COLUMN */}
                <div>
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-[10px] font-medium capitalize sm:px-3 sm:text-xs ${
                      sale.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : sale.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {sale.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* NO SALES */
        <div className="flex items-center justify-center py-8 sm:py-10">
          <p className="text-center text-xs text-gray-500 sm:text-sm">
            No recent sale has been made.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentSales;
