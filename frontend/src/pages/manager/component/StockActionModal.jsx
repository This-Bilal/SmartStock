import React from "react";
import { useNavigate } from "react-router-dom";

const StockActionModal = ({ onClose, productId }) => {
  const navigate = useNavigate();

  const handleAddStock = () => {
    navigate(`/addStock/${productId}`);
  };

  const handleRemoveStock = () => {
    navigate(`/removeStock/${productId}`);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-3 xs:px-4">
      <div className="w-full min-w-0 max-w-md rounded-xl bg-white p-3 shadow-xl xs:p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-lg xs:h-11 xs:w-11 xs:text-xl">
            📦
          </div>

          <h2 className="wrap-break-words text-base font-bold text-gray-800 xs:text-lg sm:text-xl">
            Stock Management
          </h2>

          <p className="mt-2 wrap-break-words text-xs leading-5 text-gray-500 xs:text-sm xs:leading-6">
            Choose what you want to do with this product's stock.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleAddStock}
            className="w-full rounded-lg bg-blue-50 px-3 py-2.5 text-xs font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-100 xs:text-sm sm:w-auto sm:px-4"
          >
            Add Stock
          </button>

          <button
            type="button"
            onClick={handleRemoveStock}
            className="w-full rounded-lg bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600 transition-colors duration-200 hover:bg-red-100 xs:text-sm sm:w-auto sm:px-4"
          >
            Remove Stock
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-xs font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-200 xs:text-sm sm:w-auto sm:px-4"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockActionModal;