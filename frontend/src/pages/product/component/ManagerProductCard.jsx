import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StockActionModal from "../../manager/component/StockActionModal";
import { changeProductStatus } from "../../../services/productService";
import { getProductImageUrl } from "../../../config/productImage";

const ManagerProductCard = ({ product, onStatusChange, onStatusError }) => {
  const navigate = useNavigate();

  const [stockModal, setStockModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const isOutOfStock = product.quantity === 0;

  const isLowStock =
    product.quantity > 0 && product.quantity <= product.lowStockLimit;

  const stockStatus = isOutOfStock
    ? "Out of stock"
    : isLowStock
      ? "Low stock"
      : "In stock";

  const handleAdjustStock = () => {
    setStockModal((prev) => !prev);
  };

  const handleUpdateProduct = () => {
    navigate(`/updateProduct/${product.id}`);
  };

  const handleStatusChange = async () => {
    try {
      setStatusLoading(true);

      const updatedProduct = await changeProductStatus(product.id);

      onStatusChange(updatedProduct);
    } catch (error) {
      console.error("Failed to change product status:", error);

      onStatusError(error?.message || "Failed to change product status.");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="group relative block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
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

          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${
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

        {/* Category */}
        <p className="mt-3 text-xs text-gray-500">
          Category:{" "}
          <span className="font-medium text-gray-600">
            {product.category?.name || "Uncategorized"}
          </span>
        </p>

        {/* Prices + Stock */}
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

        {/* Stock Actions */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleAdjustStock}
            className="w-full rounded-lg bg-blue-50 px-4 py-2.5 text-xs font-medium text-blue-600 transition-all duration-200 hover:bg-blue-100 sm:text-sm"
          >
            Adjust Stock
          </button>

          <button
            type="button"
            onClick={handleUpdateProduct}
            className="w-full rounded-lg bg-green-50 px-4 py-2.5 text-xs font-medium text-green-600 transition-all duration-200 hover:bg-green-100 sm:text-sm"
          >
            Edit
          </button>
        </div>

        {/* Product Status */}
        <button
          type="button"
          onClick={handleStatusChange}
          disabled={statusLoading}
          className={`mt-2 w-full rounded-lg px-4 py-2.5 text-xs font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${
            product.isActive
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-green-50 text-green-600 hover:bg-green-100"
          }`}
        >
          {statusLoading
            ? "Updating..."
            : product.isActive
              ? "Deactivate"
              : "Activate"}
        </button>
      </div>

      {/* Stock Modal */}
      {stockModal && (
        <StockActionModal
          onClose={() => setStockModal(false)}
          productId={product.id}
        />
      )}
    </div>
  );
};

export default ManagerProductCard;
