import React from "react";

const CartItem = ({ item, onQuantityChange, onRemove, loading }) => {

  console.log("Cart item:", item);
console.log("Cart image:", item.image);
  return (
    <div className="p-4 sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        {/* Product Image */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 sm:h-20 sm:w-20">
          {item.image ? (
            <img
              src={`https://smartstock-api-i50s.onrender.com${item.image}`}
              alt={item.productName}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-2xl">📦</span>
          )}
        </div>

        {/* Product Details */}
        <div className="min-w-0 flex-1">
          {/* Name + Remove */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-gray-800 sm:text-base">
                {item.productName}
              </h3>

              <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
                SKU: {item.sku}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item)}
              disabled={loading}
              className="shrink-0 text-xs font-medium text-red-400 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove
            </button>
          </div>

          {/* Price + Quantity + Subtotal */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            {/* Unit Price */}
            <p className="text-sm font-semibold text-gray-700">
              ₦{item.unitPrice?.toLocaleString()}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onQuantityChange(item, item.quantity - 1)}
                disabled={loading || item.quantity <= 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>

              <span className="min-w-6 text-center text-sm font-medium text-gray-700">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => onQuantityChange(item, item.quantity + 1)}
                disabled={loading}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>

            {/* Subtotal */}
            <p className="text-sm font-bold text-gray-800">
              ₦{item.subtotal?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
