import React from "react";

const SaleCard = ({ sale }) => {
  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 sm:p-5"
    >
      {/* Sale Number & Payment */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
            Sale Number
          </p>

          <h3 className="mt-1 truncate text-sm font-bold text-gray-800 sm:text-base">
            {sale?.saleNumber}
          </h3>
        </div>

        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium capitalize text-gray-600 sm:px-3 sm:text-xs">
          {sale?.paymentMethod}
        </span>
      </div>

      {/* Employee & Date */}
      <div className="mt-4 flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-gray-400 sm:text-xs">
            Employee
          </p>

          <p className="mt-1 truncate text-xs font-medium text-gray-700 sm:text-sm">
            {sale?.employeeName}
          </p>
        </div>
      </div>

      {/* Products Sold */}
      <div className="mt-4">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
          Products Sold
        </p>

        <div className="space-y-2">
          {sale?.items?.map((item, index) => (
            <div
              key={item?.id || index}
              className="flex items-center justify-between gap-3 rounded-md bg-gray-50 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-gray-700 sm:text-sm">
                  {item?.productName}
                </p>

                <p className="text-[10px] text-gray-400 sm:text-xs">
                  {item?.sku}
                </p>
              </div>

              <span className="shrink-0 text-xs font-semibold text-gray-600 sm:text-sm">
                × {item?.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 flex items-end justify-end border-t border-gray-100 pt-4">
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide text-gray-400 sm:text-xs">
            Total
          </p>

          <p className="mt-1 text-base font-bold text-gray-800 sm:text-lg">
            ₦{sale?.totalAmount?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaleCard;
