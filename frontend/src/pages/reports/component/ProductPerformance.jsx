import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductPerformance = ({ todaySales, weeklySales, monthlySales }) => {
  const [period, setPeriod] = useState("today");

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
  const displayedProducts = products.slice(0, 4);

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
    <section className="w-full rounded-2xl bg-white p-4 shadow-sm transition-all duration-200 sm:p-5">
      {/* HEADER */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Product Performance
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Track your best-selling products and sales performance.
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
        {/* PRODUCTS SOLD */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            Products Sold
          </p>

          <h3 className="mt-2 text-xl font-bold text-gray-800">
            {products.length}
          </h3>

          <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
            Different products sold
          </p>
        </div>

        {/* UNITS SOLD */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            Units Sold
          </p>

          <h3 className="mt-2 text-xl font-bold text-gray-800">
            {totalUnitsSold.toLocaleString()}
          </h3>

          <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
            Total quantity sold
          </p>
        </div>

        {/* BEST SELLER */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            Best Seller
          </p>

          <h3 className="mt-2 truncate text-xl font-bold text-gray-800">
            {bestSellingProduct?.productName || "—"}
          </h3>

          <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
            {bestSellingProduct
              ? `${bestSellingProduct.quantity.toLocaleString()} units sold`
              : "No sales available"}
          </p>
        </div>
      </div>

      {/* TOP PRODUCTS */}
      <div>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Top Products</h3>

          <span className="text-xs text-gray-400">
            {formatCurrency(totalRevenue)} revenue
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
              <table className="w-full min-w-162.5 text-left">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100">
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Rank
                    </th>

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
                      Sales Share
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayedProducts.map((product, index) => {
                    const salesShare =
                      totalRevenue > 0
                        ? (product.revenue / totalRevenue) * 100
                        : 0;

                    return (
                      <tr
                        key={`${product.sku}-${index}`}
                        className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50"
                      >
                        {/* RANK */}
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
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-700">
                          {formatCurrency(product.revenue)}
                        </td>

                        {/* SALES SHARE */}
                        <td className="px-4 py-3">
                          <div className="flex min-w-30 items-center gap-2">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full bg-gray-700 transition-all duration-300"
                                style={{
                                  width: `${Math.min(salesShare, 100)}%`,
                                }}
                              />
                            </div>

                            <span className="text-xs text-gray-500">
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

            {/* VIEW ALL */}
            {products.length > 4 && (
              <div className="mt-4">
                <Link
                  to="/productPerformancePage"
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-center text-xs font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 sm:text-sm"
                >
                  View All Product Performance
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductPerformance;
