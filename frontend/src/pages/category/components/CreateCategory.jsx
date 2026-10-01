import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createCategory } from "../../../services/categoryService";
import { useTitle } from "../../../hooks/useTitile";
import { MdArrowBack, MdCategory } from "react-icons/md";
import { toast, Toaster } from "sonner";

const CreateCategory = () => {
  useTitle("SmartStock: create category");

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const newCategory = await createCategory({
        name,
      });

      toast.success("Category created successfully.");
      setName("");

      // Go back to categories after successful creation
      setTimeout(() => {
        navigate("/category");
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Failed to create category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-red-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/managerhomepage")}
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors duration-200 hover:text-gray-800 hover:cursor-pointer sm:text-sm"
          >
            <MdArrowBack className="text-base sm:text-lg" />
            Back
          </button>

          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
            Create Category
          </h1>

          <p className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-sm lg:text-base">
            Create a new product category.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          {/* CARD HEADER */}
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5 sm:mb-8 sm:pb-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 sm:h-12 sm:w-12">
              <MdCategory className="text-xl sm:text-2xl" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                Category Information
              </h2>

              <p className="text-xs text-gray-400 sm:text-sm">
                Enter the name of the new category.
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* CATEGORY NAME */}
            <div>
              <label
                htmlFor="categoryName"
                className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm"
              >
                Category Name
              </label>

              <input
                id="categoryName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                disabled={loading}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5 sm:pt-6">
              <Link
                to="/category"
                className="rounded-lg bg-gray-100 px-4 py-2.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-gray-200 sm:px-5 sm:text-sm"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-red-500 px-4 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-sm"
              >
                {loading ? "Creating..." : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreateCategory;
