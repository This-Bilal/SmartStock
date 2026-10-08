import { useState } from "react";
import AddToCartModal from "../../cahier/component/AddToCartModal";
import { getProductImageUrl } from "../../../config/productImage";

const CashierProductCard = ({ product, onAddToCart, loading }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
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
          {/* Name */}
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-gray-800 sm:text-base">
              {product.name}
            </h2>

            <p className="mt-1 text-xs text-gray-400">SKU: {product.sku}</p>
          </div>

          {/* Category */}
          <p className="mt-3 text-xs text-gray-500">
            Category:{" "}
            <span className="font-medium text-gray-600">
              {product.category?.name || "Uncategorized"}
            </span>
          </p>

          {/* Price */}
          <div className="mt-4">
            <p className="text-[10px] text-gray-400">Selling Price</p>

            <p className="mt-1 text-base font-bold text-gray-800">
              ₦{product.price?.toLocaleString()}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleOpenModal}
            className="mt-4 w-full rounded-lg bg-red-500 px-3 py-2.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-red-600 sm:text-sm"
          >
            Add to cart
          </button>
        </div>
      </div>

      {/* Add To Cart Modal */}
      {showModal && (
        <AddToCartModal
          product={product}
          onClose={handleCloseModal}
          onAddToCart={onAddToCart}
          loading={loading}
        />
      )}
    </>
  );
};

export default CashierProductCard;
