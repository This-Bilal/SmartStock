import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdCategory } from "react-icons/md";
import { useTitle } from "../../../hooks/useTitile";
import { getAllCategories, updateCategory } from "../../../services/categoryService";
import BackButton from "../../../components/other/BackButton";
import { toast, Toaster } from "sonner";

const UpdateCategory = () => {
  useTitle("SmartStock: update category");

  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // GET CATEGORY
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);

        const categories = await getAllCategories();

        const category = categories.find(
          (category) => category.id === categoryId,
        );

        if (!category) {
          setError("Category not found.");
          return;
        }

        setName(category.name);
      } catch (error) {
        toast.error(error.message || "Failed to load category.")
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  // UPDATE CATEGORY
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const updatedCategory = await updateCategory(categoryId, name);

      setName(updatedCategory.name);
      toast.success("Category updated successfully.")

      // Go back to categories after a short delay
      setTimeout(() => {
        navigate("/category");
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Failed to update category.")
    } finally {
      setUpdating(false);
    }
  };

 
// LOADING STATE
if (loading) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-red-50 px-4">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

        <p className="text-sm text-gray-500">
          Loading category...
        </p>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen w-full bg-red-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <BackButton/>

          <div>
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
              Update Category
            </h1>

            <p className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-sm lg:text-base">
              Update the name of your product category.
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          {/* CATEGORY ICON */}
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5 sm:mb-8 sm:pb-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 sm:h-12 sm:w-12">
              <MdCategory className="text-xl sm:text-2xl" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                Category Information
              </h2>

              <p className="text-xs text-gray-400 sm:text-sm">
                Change the category name below.
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
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
                disabled={updating}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5 sm:pt-6">
              <Link
                to="/category"
                className="rounded-lg bg-gray-100 px-4 py-2.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-gray-200 sm:px-5 sm:text-sm"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={updating}
                className="rounded-lg bg-red-500 px-4 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-sm"
              >
                {updating ? "Updating..." : "Update Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UpdateCategory;