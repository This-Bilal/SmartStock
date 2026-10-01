import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProfitAnalysis = ({ todaySales, weeklySales, monthlySales }) => {
  const [period, setPeriod] = useState("today");

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

  // Calculate all products.
  const products = calculateProfitAnalysis(currentData);

  // Display only the first 4 products on the dashboard.
  const displayedProducts = products.slice(0, 4);

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
    <section className="w-full rounded-2xl bg-white p-4 shadow-sm transition-all duration-200 sm:p-5">
      {/* HEADER */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Profit Analysis
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Analyze product profitability and margins.
          </p>
        </div>

        {/* PERIOD SELECTOR */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-gray-400 focus:bg-white sm:w-auto"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* REVENUE */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            Revenue
          </p>

          <h3 className="mt-2 text-xl font-bold text-gray-800">
            {formatCurrency(totalRevenue)}
          </h3>
        </div>

        {/* COST */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            Product Cost
          </p>

          <h3 className="mt-2 text-xl font-bold text-gray-800">
            {formatCurrency(totalCost)}
          </h3>
        </div>

        {/* PROFIT */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            Gross Profit
          </p>

          <h3
            className={`mt-2 text-xl font-bold ${
              totalProfit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(totalProfit)}
          </h3>

          <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
            {overallMargin.toFixed(1)}% overall margin
          </p>
        </div>
      </div>

      {/* PRODUCT PROFITABILITY */}
      <div>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold text-gray-700">
            Product Profitability
          </h3>

          <span className="text-xs text-gray-400">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* EMPTY STATE */}
        {products.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">
              No sales available for this period.
            </p>
          </div>
        ) : (
          <>
            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full min-w-175 text-left">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100">
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Product
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Qty Sold
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Revenue
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Cost
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Profit
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Margin
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayedProducts.map((product, index) => (
                    <tr
                      key={`${product.sku}-${index}`}
                      className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50"
                    >
                      {/* PRODUCT */}
                      <td className="px-4 py-3">
                        <div className="min-w-32.5">
                          <p className="truncate text-sm font-medium text-gray-800">
                            {product.productName}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {product.sku}
                          </p>
                        </div>
                      </td>

                      {/* QUANTITY */}
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {product.quantity.toLocaleString()}
                      </td>

                      {/* REVENUE */}
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {formatCurrency(product.revenue)}
                      </td>

                      {/* COST */}
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {formatCurrency(product.cost)}
                      </td>

                      {/* PROFIT */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`text-sm font-semibold ${
                            product.profit >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(product.profit)}
                        </span>
                      </td>

                      {/* MARGIN */}
                      <td className="px-4 py-3">
                        <span
                          className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ${
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

            {/* VIEW ALL */}
            {products.length > 4 && (
              <div className="mt-4">
                <Link
                  to="/ProfitAnalysisPage"
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-center text-xs font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 sm:text-sm"
                >
                  View All Product Profit Analysis
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProfitAnalysis;
