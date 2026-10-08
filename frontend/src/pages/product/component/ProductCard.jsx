import React from "react";
import { getProductImageUrl } from "../../../config/productImage";

const ProductCard = ({ product }) => {
  const isOutOfStock = product.quantity === 0;
  const isLowStock =
    product.quantity > 0 && product.quantity <= product.lowStockLimit;

  const stockStatus = isOutOfStock
    ? "Out of stock"
    : isLowStock
      ? "Low stock"
      : "In stock";

  return (
    <div className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Image */}
      <div className="flex h-40 items-center justify-center bg-gray-50 p-2">
        {product.image ? (
          <img
            src={getProductImageUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <span className="text-4xl">📦</span>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        {/* Name + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-gray-800 sm:text-base">
              {product.name}
            </h2>

            <p className="mt-1 text-xs text-gray-400">SKU: {product.sku}</p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            {/* Product Status */}
            <span
              className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                product.isActive
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </span>

            {/* Stock Status */}
            <span
              className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                isOutOfStock
                  ? "bg-red-100 text-red-600"
                  : isLowStock
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-600"
              }`}
            >
              {stockStatus}
            </span>
          </div>
        </div>

        {/* Category */}
        <p className="mt-3 text-xs text-gray-500">
          Category:{" "}
          <span className="font-medium text-gray-600">
            {product.category?.name || "Uncategorized"}
          </span>
        </p>

        {/* Price + Stock */}
        <div className="mt-4 flex items-end justify-between gap-3">
          {/* Prices */}
          <div className="flex gap-4">
            {/* Selling Price */}
            <div>
              <p className="text-[9px] text-gray-400 sm:text-[10px]">
                Selling Price
              </p>

              <p className="mt-0.5 text-sm font-bold text-gray-800 sm:text-base">
                ₦{product.price?.toLocaleString()}
              </p>
            </div>

            {/* Cost Price */}
            <div>
              <p className="text-[9px] text-gray-400 sm:text-[10px]">
                Cost Price
              </p>

              <p className="mt-0.5 text-xs font-medium text-gray-500 sm:text-sm">
                ₦{product.costPrice?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Stock */}
          <div className="text-right">
            <p className="text-[9px] text-gray-400 sm:text-[10px]">Stock</p>

            <p
              className={`mt-0.5 text-sm font-bold ${
                isOutOfStock
                  ? "text-red-600"
                  : isLowStock
                    ? "text-yellow-600"
                    : "text-gray-700"
              }`}
            >
              {product.quantity}
              <span className="ml-0.5 text-[10px] font-medium text-gray-400">
                / {product.lowStockLimit}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
