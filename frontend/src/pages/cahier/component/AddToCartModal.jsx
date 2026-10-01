import React, { useState } from "react";

const AddToCartModal = ({ onClose, product, onAddToCart, loading }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    const success = await onAddToCart(product, quantity);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 xs:px-4">
      <div className="w-full min-w-0 max-w-md rounded-xl bg-white p-3 shadow-xl xs:p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg xs:h-11 xs:w-11 xs:text-xl">
            🛒
          </div>

          <h2 className="wrap-break-words text-base font-bold text-gray-800 xs:text-lg sm:text-xl">
            Add to Cart
          </h2>

          <p className="mt-2 wrap-break-words text-xs leading-5 text-gray-500 xs:text-sm xs:leading-6">
            Enter the quantity you want to add to the cart.
          </p>
        </div>

        {/* Product */}
        <div className="mb-4 rounded-lg bg-gray-50 p-3 xs:p-4">
          <p className="wrap-break-words text-sm font-semibold text-gray-800 sm:text-base">
            {product?.name}
          </p>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            ₦{product?.price?.toLocaleString() || 0}
          </p>
        </div>

        {/* Quantity */}
        <div className="mb-5">
          <label
            htmlFor="quantity"
            className="mb-2 block text-xs font-medium text-gray-700 xs:text-sm"
          >
            Quantity
          </label>

          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={loading}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={loading || quantity < 1}
            className="w-full rounded-lg bg-red-50 px-3 py-2.5 text-xs font-medium text-red-500 transition-colors duration-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 xs:text-sm sm:w-auto sm:px-4"
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-xs font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 xs:text-sm sm:w-auto sm:px-4"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
