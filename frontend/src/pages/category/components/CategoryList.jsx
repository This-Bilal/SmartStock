import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import { getAllCategories } from "../../../services/categoryService";
import { toast, Toaster } from "sonner";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        toast.error(error?.message || "Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // UPDATE CATEGORY AFTER STATUS CHANGE
  const handleCategoryStatusChange = (updatedCategory) => {
    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category,
      ),
    );
  };

  // HANDLE SUCCESS MESSAGE
  const handleSuccess = (message) => {
    toast.success(message);
  };

  // HANDLE ERROR MESSAGE
  const handleError = (message) => {
    toast.error(message);
  };

  // FILTER CATEGORIES
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && category?.isActive) ||
      (filter === "inactive" && !category?.isActive);

    return matchesSearch && matchesFilter;
  });

  return (
    <section className="w-full px-4 py-6 sm:px-6 lg:px-10">
      {/* CREATE CATEGORY */}
      <div className="mb-5 flex justify-end">
        <Link
          to="/createcategory"
          className="rounded-lg bg-red-500 px-4 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 sm:px-5 sm:text-sm"
        >
          Create Category
        </Link>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="mb-6 space-y-4 sm:mb-8">
        {/* SEARCH BAR */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:text-base"
          />
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setFilter("active")}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
              filter === "active"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Active Categories
          </button>

          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Categories
          </button>

          <button
            type="button"
            onClick={() => setFilter("inactive")}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
              filter === "inactive"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Inactive Categories
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 py-10 shadow-md sm:p-5 lg:p-6">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

          <p className="mt-3 text-xs text-gray-500 sm:text-sm">
            Loading categories...
          </p>
        </div>
      )}

      {/* CATEGORY CARDS */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {!loading &&
          filteredCategories.length > 0 &&
          filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onStatusChange={handleCategoryStatusChange}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          ))}

        {!loading && filteredCategories.length === 0 && (
          <div className="col-span-full rounded-xl border border-gray-100 bg-white px-4 py-10 text-center shadow-sm">
            <p className="text-sm text-gray-500 sm:text-base">
              No categories found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryList;
