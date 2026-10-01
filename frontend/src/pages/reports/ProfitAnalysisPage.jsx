import React, { useEffect, useState } from "react";
import {
  getTodaySales,
  getWeeklySales,
  getMonthlySales,
} from "../../services/reportService";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";

const ProfitAnalysisPage = () => {
  useTitle("SmartStock: profit analysis");

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
        setError(error?.message || "Failed to load product profit analysis.");
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

  const calculateProfitAnalysis = (data) => {
    const products = {};

    data?.sales?.forEach((sale) => {
      sale?.items?.forEach((item) => {
        const productId = item?.id;
        const quantity = item?.quantity ?? 0;
        const costPrice = item?.costPrice ?? 0;
        const subtotal = item?.subtotal ?? 0;

        if (!products[productId]) {
          products[productId] = {
            productName: item?.productName,
            sku: item?.sku,
            quantity: 0,
            revenue: 0,
            cost: 0,
            profit: 0,
          };
        }

        const cost = costPrice * quantity;
        const profit = subtotal - cost;

        products[productId].quantity += quantity;
        products[productId].revenue += subtotal;
        products[productId].cost += cost;
        products[productId].profit += profit;
      });
    });

    return Object.values(products)
      .map((product) => ({
        ...product,
        margin:
          product.revenue > 0 ? (product.profit / product.revenue) * 100 : 0,
      }))
      .sort((a, b) => b.profit - a.profit);
  };

  const products = calculateProfitAnalysis(currentData);

  const totalRevenue = products.reduce(
    (total, product) => total + product.revenue,
    0,
  );

  const totalCost = products.reduce(
    (total, product) => total + product.cost,
    0,
  );

  const totalProfit = products.reduce(
    (total, product) => total + product.profit,
    0,
  );

  const overallMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <main className="min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-5">
          <BackButton />
        </div>

        {/* Page Header */}
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
              Product Profit Analysis
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
              View the profitability and profit margins of all your products.
            </p>
          </div>

          {/* Period Selector */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 outline-none transition-all duration-200 focus:border-gray-400 focus:bg-white sm:w-auto sm:min-w-35 sm:text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className=" flex flex-col items-center justify-center rounded-2xl py-10 bg-white p-4 shadow-md sm:p-5 lg:p-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Loading product profit analysis...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-gray-100 bg-white px-4 py-8 text-center text-xs text-red-500 shadow-sm sm:rounded-2xl sm:px-5 sm:py-10 sm:text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Summary Cards */}
            <div className="mb-5 grid grid-cols-2 gap-2.5 sm:mb-6 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
              {/* Products */}
              <div className="min-w-0 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
                <p className="truncate text-xs font-medium text-gray-500 sm:text-sm">
                  Products
                </p>

                <h2 className="mt-1.5 text-lg font-bold text-gray-800 sm:mt-2 sm:text-xl">
                  {products.length}
                </h2>

                <p className="mt-1 text-[10px] leading-4 text-gray-400 sm:text-xs">
                  Products with sales
                </p>
              </div>

              {/* Revenue */}
              <div className="min-w-0 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
                <p className="truncate text-xs font-medium text-gray-500 sm:text-sm">
                  Revenue
                </p>

                <h2 className="mt-1.5 truncate text-base font-bold text-gray-800 sm:mt-2 sm:text-xl">
                  {formatCurrency(totalRevenue)}
                </h2>
              </div>

              {/* Cost */}
              <div className="min-w-0 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
                <p className="truncate text-xs font-medium text-gray-500 sm:text-sm">
                  Product Cost
                </p>

                <h2 className="mt-1.5 truncate text-base font-bold text-gray-800 sm:mt-2 sm:text-xl">
                  {formatCurrency(totalCost)}
                </h2>
              </div>

              {/* Profit */}
              <div className="min-w-0 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
                <p className="truncate text-xs font-medium text-gray-500 sm:text-sm">
                  Gross Profit
                </p>

                <h2
                  className={`mt-1.5 truncate text-base font-bold sm:mt-2 sm:text-xl ${
                    totalProfit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(totalProfit)}
                </h2>

                <p className="mt-1 truncate text-[10px] text-gray-400 sm:text-xs">
                  {overallMargin.toFixed(1)}% overall margin
                </p>
              </div>
            </div>

            {/* Product Table */}
            <section className="w-full rounded-xl bg-white p-3 shadow-sm transition-all duration-200 sm:rounded-2xl sm:p-5">
              {/* Table Header */}
              <div className="mb-4 flex flex-col gap-1.5 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                    All Product Profitability
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    {products.length} product
                    {products.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center sm:p-8">
                  <p className="text-xs text-gray-500 sm:text-sm">
                    No sales available for this period.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full min-w-200 text-left">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-100">
                        {[
                          "#",
                          "Product",
                          "Qty Sold",
                          "Revenue",
                          "Cost",
                          "Profit",
                          "Margin",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="whitespace-nowrap px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:px-4 sm:py-3 sm:text-xs"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {products.map((product, index) => (
                        <tr
                          key={`${product.sku}-${index}`}
                          className="border-b border-gray-100 last:border-b-0 transition hover:bg-gray-50"
                        >
                          {/* Rank */}
                          <td className="px-3 py-3 sm:px-4 sm:py-4">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold sm:h-7 sm:w-7 sm:text-xs ${
                                index === 0
                                  ? "bg-gray-800 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {index + 1}
                            </span>
                          </td>

                          {/* Product */}
                          <td className="max-w-45 px-3 py-3 sm:px-4 sm:py-4">
                            <p className="truncate text-xs font-medium text-gray-800 sm:text-sm">
                              {product.productName}
                            </p>

                            <p className="mt-0.5 truncate text-[10px] text-gray-400 sm:text-xs">
                              {product.sku}
                            </p>
                          </td>

                          {/* Quantity */}
                          <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-600 sm:px-4 sm:py-4 sm:text-sm">
                            {product.quantity.toLocaleString()}
                          </td>

                          {/* Revenue */}
                          <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-600 sm:px-4 sm:py-4 sm:text-sm">
                            {formatCurrency(product.revenue)}
                          </td>

                          {/* Cost */}
                          <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-600 sm:px-4 sm:py-4 sm:text-sm">
                            {formatCurrency(product.cost)}
                          </td>

                          {/* Profit */}
                          <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-4">
                            <span
                              className={`text-xs font-semibold sm:text-sm ${
                                product.profit >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {formatCurrency(product.profit)}
                            </span>
                          </td>

                          {/* Margin */}
                          <td className="px-3 py-3 sm:px-4 sm:py-4">
                            <span
                              className={`whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-medium sm:text-xs ${
                                product.margin >= 30
                                  ? "bg-green-50 text-green-600"
                                  : product.margin >= 15
                                    ? "bg-yellow-50 text-yellow-600"
                                    : "bg-red-50 text-red-600"
                              }`}
                            >
                              {product.margin.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
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

export default ProfitAnalysisPage;
