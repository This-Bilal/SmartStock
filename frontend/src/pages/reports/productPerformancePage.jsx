import React, { useEffect, useState } from "react";
import {
  getTodaySales,
  getWeeklySales,
  getMonthlySales,
} from "../../services/reportService";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";

const ProductPerformancePage = () => {
  useTitle("SmartStock: product performance");

  const [period, setPeriod] = useState("today");
  const [todaySales, setTodaySales] = useState(null);
  const [weeklySales, setWeeklySales] = useState(null);
  const [monthlySales, setMonthlySales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        const [today, weekly, monthly] = await Promise.all([
          getTodaySales(),
          getWeeklySales(),
          getMonthlySales(),
        ]);

        setTodaySales(today);
        setWeeklySales(weekly);
        setMonthlySales(monthly);
      } catch (error) {
        setError(error?.message || "Failed to load product performance.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getCurrentData = () => {
    if (period === "today") return todaySales;
    if (period === "week") return weeklySales;
    return monthlySales;
  };

  const currentData = getCurrentData();

  const calculateProductPerformance = (data) => {
    const products = {};

    data?.sales?.forEach((sale) => {
      sale?.items?.forEach((item) => {
        const productId = item?.id;
        const quantity = item?.quantity ?? 0;
        const subtotal = item?.subtotal ?? 0;

        if (!products[productId]) {
          products[productId] = {
            productName: item?.productName,
            sku: item?.sku,
            quantity: 0,
            revenue: 0,
          };
        }

        products[productId].quantity += quantity;
        products[productId].revenue += subtotal;
      });
    });

    return Object.values(products).sort((a, b) => b.quantity - a.quantity);
  };

  const products = calculateProductPerformance(currentData);

  const totalUnitsSold = products.reduce(
    (total, product) => total + product.quantity,
    0,
  );

  const totalRevenue = products.reduce(
    (total, product) => total + product.revenue,
    0,
  );

  const bestSellingProduct = products[0];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <main className="min-h-screen w-full bg-red-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-5">
          <BackButton />
        </div>

        {/* Loading */}
        {loading && (
          <div className=" flex flex-col items-center justify-center rounded-2xl py-10 bg-white p-4 shadow-md sm:p-5 lg:p-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Loading product performance...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-white px-4 py-10 text-center shadow-sm sm:px-5">
            <p className="text-xs text-red-500 sm:text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl">
                  Product Performance
                </h1>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  View the sales performance of all your products.
                </p>
              </div>

              {/* Period Selector */}
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none transition-all duration-200 focus:border-gray-400 sm:w-auto sm:px-4 sm:py-2.5 sm:text-sm"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {/* Products Sold */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                  Products Sold
                </p>

                <h2 className="mt-2 text-xl font-bold text-gray-800 sm:text-2xl">
                  {products.length}
                </h2>

                <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
                  Different products sold
                </p>
              </div>

              {/* Units Sold */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                  Units Sold
                </p>

                <h2 className="mt-2 text-xl font-bold text-gray-800 sm:text-2xl">
                  {totalUnitsSold.toLocaleString()}
                </h2>

                <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
                  Total quantity sold
                </p>
              </div>

              {/* Best Seller */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                  Best Seller
                </p>

                <h2 className="mt-2 truncate text-xl font-bold text-gray-800 sm:text-2xl">
                  {bestSellingProduct?.productName || "—"}
                </h2>

                <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
                  {bestSellingProduct
                    ? `${bestSellingProduct.quantity.toLocaleString()} units sold`
                    : "No sales available"}
                </p>
              </div>
            </div>

            {/* Product Performance */}
            <section className="w-full rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              {/* Section Header */}
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    All Product Performance
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Products ranked by quantity sold.
                  </p>
                </div>

                <span className="text-xs text-gray-400">
                  {formatCurrency(totalRevenue)} revenue
                </span>
              </div>

              {/* Empty State */}
              {products.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-7 text-center sm:p-8">
                  <p className="text-xs text-gray-500 sm:text-sm">
                    No sales available for this period.
                  </p>
                </div>
              ) : (
                /* Table */
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full min-w-200 text-left">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-100">
                        {[
                          "Rank",
                          "Product",
                          "Qty Sold",
                          "Revenue",
                          "Sales Share",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {products.map((product, index) => {
                        const salesShare =
                          totalRevenue > 0
                            ? (product.revenue / totalRevenue) * 100
                            : 0;

                        return (
                          <tr
                            key={`${product.sku}-${index}`}
                            className="border-b border-gray-100 transition-colors duration-200 last:border-b-0 hover:bg-gray-50"
                          >
                            {/* Rank */}
                            <td className="px-4 py-3">
                              <span
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                                  index === 0
                                    ? "bg-gray-800 text-white"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {index + 1}
                              </span>
                            </td>

                            {/* Product */}
                            <td className="max-w-50 px-4 py-3">
                              <p className="truncate text-xs font-medium text-gray-800 sm:text-sm">
                                {product.productName}
                              </p>

                              <p className="mt-0.5 truncate text-[11px] text-gray-400 sm:text-xs">
                                {product.sku}
                              </p>
                            </td>

                            {/* Quantity */}
                            <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-600 sm:text-sm">
                              {product.quantity.toLocaleString()}
                            </td>

                            {/* Revenue */}
                            <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-gray-700 sm:text-sm">
                              {formatCurrency(product.revenue)}
                            </td>

                            {/* Sales Share */}
                            <td className="px-4 py-3">
                              <div className="flex min-w-35 items-center gap-2">
                                <div className="h-2 w-20 shrink-0 overflow-hidden rounded-full bg-gray-100">
                                  <div
                                    className="h-full rounded-full bg-gray-700"
                                    style={{
                                      width: `${Math.min(salesShare, 100)}%`,
                                    }}
                                  />
                                </div>

                                <span className="whitespace-nowrap text-[11px] text-gray-500 sm:text-xs">
                                  {salesShare.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default ProductPerformancePage;
