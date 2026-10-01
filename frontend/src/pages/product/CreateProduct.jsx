import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";
import { createProduct } from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import { toast, Toaster } from "sonner";

const CreateProduct = () => {
  useTitle("SmartStock: add product");

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formdata, setFormdata] = useState({
    name: "",
    category: "",
    price: "",
    costPrice: "",
    lowStockLimit: "",
    image: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      try {
        const categories = await getAllCategories();
        setCategories(categories);
      } catch (error) {
        toast.error(error?.message || "Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await createProduct(formdata);

      toast.success("Product created successfully.");

      setTimeout(() => {
        navigate("/managerProductList");
      }, 1000);
    } catch (error) {
      toast.error(error?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  // For image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setFormdata((prev) => ({
      ...prev,
      image: file,
    }));
  };

  return (
    <main className="min-h-screen w-full bg-red-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* BACK BUTTON */}
        <div className="mb-5 sm:mb-6">
          <BackButton />
        </div>

        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl">
            Add Product
          </h1>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm md:text-base">
            Add more product to the business.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div className="mb-4 sm:mb-5">
              <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={formdata.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                Category
              </label>

              <select
                name="category"
                value={formdata.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              >
                <option value="">Select a category</option>

                {categories
                  .filter((category) => category.isActive)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* PRICE */}
            <div className="mb-4 sm:mb-5">
              <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formdata.price}
                onChange={handleChange}
                placeholder="Enter selling price"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />
            </div>

            {/* COST PRICE */}
            <div className="mb-4 sm:mb-5">
              <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
                Cost price
              </label>

              <input
                type="number"
                name="costPrice"
                value={formdata.costPrice}
                onChange={handleChange}
                placeholder="Enter cost price"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />
            </div>

            {/* LOW STOCK LIMIT */}
            <div className="mb-4 sm:mb-5">
              <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
                Low stock limit
              </label>

              <input
                type="number"
                name="lowStockLimit"
                value={formdata.lowStockLimit}
                onChange={handleChange}
                placeholder="Enter low stock limit"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />
            </div>

            {/* IMAGE */}
            <div className="mb-4 sm:mb-5">
              <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
                Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-2 border-t border-gray-100 pt-4 sm:gap-3 sm:pt-5">
              {/* CANCEL */}
              <Link
                to="/managerProductList"
                className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-center text-xs font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 sm:px-4 sm:py-2.5 sm:text-sm md:text-base"
              >
                Cancel
              </Link>

              {/* CREATE */}
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 sm:px-4 sm:py-2.5 sm:text-sm md:px-4 md:py-2.5 md:text-base ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {loading ? "Creating..." : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreateProduct;
