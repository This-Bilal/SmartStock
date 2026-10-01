import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";
import { addStock } from "../../services/inventoryService";
import { getAllProducts } from "../../services/productService";
import { toast, Toaster } from "sonner";

const AddStock = () => {
  useTitle("SmartStock: add stock");

  const navigate = useNavigate();
  const { productId } = useParams();

  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("Stock_in");
  const [loading, setLoading] = useState(false);

  /*Fetch all products*/
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const products = await getAllProducts();

        const product = products.find((product) => product.id === productId);

        if (!product) {
          setError("Product not found");
          return;
        }
      } catch (error) {
        toast.error(error?.message || "Failed to fetch products.")
      } finally {
        setLoading(false);
      }
    };

    fetchProducts()
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const newQuantity = await addStock(productId, { quantity, reason });

      toast.success("Stock added successfully.")

      // Go back to products after a short delay
      setTimeout(() => {
        navigate("/managerProductList");
      }, 1000);
    } catch (error) {
      toast.error(error?.message || "Failed to add stock.")
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen w-full bg-red-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <BackButton />

          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
            Add to stock
          </h1>

          <p className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-sm lg:text-base">
            Enter the quantity of stock you want to add
          </p>
        </div>

        {/* FORM */}
        <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* CATEGORY NAME */}
            <div>
              <label
                htmlFor="categoryName"
                className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm"
              >
                Quantity
              </label>

              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter stock quantity"
                disabled={loading}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:px-4 sm:py-2.5"
              />
            </div>

            <div>
              <label
                htmlFor="categoryName"
                className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm"
              >
                Reason
              </label>

              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for adding stock"
                disabled={loading}
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
                disabled={loading}
                className="rounded-lg bg-red-500 px-4 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-sm"
              >
                {loading ? "Adding..." : "Add stock"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddStock;
