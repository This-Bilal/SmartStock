import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllProducts, updateProduct } from "../../services/productService";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";
import { getAllCategories } from "../../services/categoryService";
import { toast, Toaster } from "sonner";

const UpdateProduct = () => {
  useTitle("SmartStock: update stock");

  const navigate = useNavigate();
  const { productId } = useParams();

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState("");
  const [product, setProduct] = useState("");
  const [categories, setCategories] = useState([]);

  const [formdata, setFormdata] = useState({
    name: "",
    category: "",
    price: "",
    costPrice: "",
    lowStockLimit: "",
    image: null,
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      try {
        const categories = await getAllCategories();
        setCategories(categories);
      } catch (error) {
        toast.error("Failed to fetch categories")
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch product
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const products = await getAllProducts();

        const product = products.find((product) => product.id === productId);

        if (!product) {
          toast.error("Product not found.")
          return;
        }

        setProduct(product);

        setFormdata({
          name: product.name,
          category: product.category.id,
          price: product.price,
          costPrice: product.costPrice,
          lowStockLimit: product.lowStockLimit,
          image: null,
        });
      } catch (error) {
        toast.error(error?.message || "Failed to fetch products")
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productId]);

  // Handle normal inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormdata((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      setUpdating(true);

      const updatedProduct = await updateProduct(productId, formdata);

      setProduct(updatedProduct);

      setFormdata({
        name: updatedProduct.name,
        category: updatedProduct.category.id,
        price: updatedProduct.price,
        costPrice: updatedProduct.costPrice,
        lowStockLimit: updatedProduct.lowStockLimit,
        image: null,
      });

      toast.success("Product updated successfully.")

      // Go back to products after a short delay
      setTimeout(() => {
        navigate("/managerProductList");
      }, 1000);
    } catch (error) {
      toast.error(error?.message || "Failed to update product.")
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-red-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <BackButton />

          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
            Update Product
          </h1>
        </div>

        {/* FORM */}
        <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                Name
              </label>

              <input
                name="name"
                type="text"
                value={formdata.name}
                onChange={handleChange}
                disabled={updating}
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
                disabled={updating}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                Price
              </label>

              <input
                name="price"
                type="number"
                value={formdata.price}
                onChange={handleChange}
                disabled={updating}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />
            </div>

            {/* COST PRICE */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                Cost price
              </label>

              <input
                name="costPrice"
                type="number"
                value={formdata.costPrice}
                onChange={handleChange}
                disabled={updating}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />
            </div>

            {/* LOW STOCK LIMIT */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                Low stock limit
              </label>

              <input
                name="lowStockLimit"
                type="number"
                value={formdata.lowStockLimit}
                onChange={handleChange}
                disabled={updating}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                Image
              </label>

              {/* Current image */}
              {product.image && (
                <div className="mb-3">
                  <p className="mb-2 text-xs text-gray-400">Current image</p>

                  <img
                    src={`http://localhost:3000${product.image}`}
                    alt={product.name}
                    className="h-32 w-32 rounded-lg bg-gray-50 object-contain"
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={updating}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5 sm:pt-6">
              <Link
                to="/managerProductList"
                className="rounded-lg bg-gray-100 px-4 py-2.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-gray-200 sm:px-5 sm:text-sm"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading || updating}
                className="rounded-lg bg-red-500 px-4 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-sm"
              >
                {updating ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UpdateProduct;
