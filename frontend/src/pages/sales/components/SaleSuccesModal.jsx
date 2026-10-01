import React from "react";
import { Link } from "react-router-dom";

const SaleSuccessModal = ({ sale, onClose }) => {
  if (!sale) return null;

  const totalItems =
    sale.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-3 py-4">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl">
          {/* Header */}
          <div className="border-b border-gray-100 px-4 py-3 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg">
              ✓
            </div>

            <h2 className="mt-2 text-base font-bold text-gray-800">
              Sale Completed
            </h2>

            <p className="mt-0.5 text-[11px] text-gray-500">
              The sale was completed successfully.
            </p>
          </div>

          {/* Sale Details */}
          <div className="px-4 py-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-gray-500">Sale Number</span>

                <span className="text-[11px] font-semibold text-gray-800">
                  {sale.saleNumber}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-gray-500">Date</span>

                <span className="text-right text-[11px] font-medium text-gray-700">
                  {sale.date}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-gray-500">Employee</span>

                <span className="text-[11px] font-medium text-gray-700">
                  {sale.employeeName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-gray-500">
                  Payment Method
                </span>

                <span className="text-[11px] font-medium capitalize text-gray-700">
                  {sale.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-gray-500">
                  Payment Status
                </span>

                <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium capitalize text-green-600">
                  {sale.paymentStatus}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-gray-500">Items</span>

                <span className="text-[11px] font-medium text-gray-700">
                  {totalItems}
                </span>
              </div>
            </div>

            {/* Items */}
            {sale.items?.length > 0 && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <h3 className="mb-2 text-[11px] font-semibold text-gray-700">
                  Items
                </h3>

                <div className="space-y-1.5">
                  {sale.items.map((item, index) => (
                    <div
                      key={item.product || index}
                      className="flex items-center justify-between gap-3 text-[11px]"
                    >
                      <div className="min-w-0">
                        <p className="wrap-break-words font-medium text-gray-700">
                          {item.productName}
                        </p>

                        <p className="text-[10px] text-gray-400">
                          {item.quantity} × ₦{item.unitPrice?.toLocaleString()}
                        </p>
                      </div>

                      <span className="shrink-0 font-medium text-gray-700">
                        ₦{item.subtotal?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="mt-3 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-800">
                  Total
                </span>

                <span className="text-base font-bold text-gray-800">
                  ₦{sale.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 rounded-b-xl border-t border-gray-100 bg-gray-50 px-4 py-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-red-600"
            >
              Close
            </button>

            <Link
              to={`/sales/${sale.saleNumber}`}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-[11px] font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              View Sale
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleSuccessModal;
