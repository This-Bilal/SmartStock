import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdCategory } from "react-icons/md";
import { changeCategoryStatus } from "../../../services/categoryService";

const CategoryCard = ({ category, onStatusChange, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async () => {
    try {
      setLoading(true);

      const updatedCategory = await changeCategoryStatus(category?.id);

      // Send the updated category back to CategoryList
      onStatusChange(updatedCategory);

      onSuccess(
        updatedCategory.isActive
          ? "Category activated successfully."
          : "Category deactivated successfully.",
      );
    } catch (error) {
      onError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to change category status.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5">
      {/* CATEGORY INFO */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            Category
          </p>

          <p className="mt-1.5 truncate text-lg font-bold capitalize text-gray-800 sm:mt-2 sm:text-2xl">
            {category?.name || "Unnamed"}
          </p>

          <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
            Product category
          </p>
        </div>

        {/* CATEGORY ICON */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 sm:h-11 sm:w-11">
          <MdCategory className="text-xl sm:text-2xl" />
        </div>
      </div>

      {/* STATUS + ACTION */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* STATUS */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 sm:text-sm">
              Status:
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium sm:text-xs ${
                category?.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {category?.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-2">
            {/* UPDATE CATEGORY */}
            <Link
              to={`/updatecategory/${category?.id}`}
              className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition-all duration-200 hover:bg-blue-100 sm:px-4 sm:text-sm"
            >
              Update
            </Link>

            {/* STATUS BUTTON */}
            <button
              type="button"
              onClick={handleStatusChange}
              disabled={loading}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm ${
                category?.isActive
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
            >
              {loading
                ? "Updating..."
                : category?.isActive
                  ? "Deactivate"
                  : "Activate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
