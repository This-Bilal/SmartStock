import React, { useState } from "react";

const FinancialSummary = ({ todaySales, weeklySales, monthlySales }) => {
  const [period, setPeriod] = useState("today");

  const dataByPeriod = {
    today: todaySales,
    week: weeklySales,
    month: monthlySales,
  };

  const currentData = dataByPeriod[period];

  const calculateFinancials = (salesData) => {
    let revenue = 0;
    let cost = 0;

    salesData?.sales?.forEach((sale) => {
      sale?.items?.forEach((item) => {
        const quantity = item?.quantity ?? 0;
        const subtotal = item?.subtotal ?? 0;
        const costPrice = item?.costPrice ?? 0;

        revenue += subtotal;
        cost += costPrice * quantity;
      });
    });

    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return { revenue, cost, profit, margin };
  };

  const financialData = calculateFinancials(currentData);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <section className="w-full rounded-2xl bg-white p-4 shadow-sm sm:p-5">
      {/* Header */}
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Financial Summary
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Overview of your revenue, costs and profit.
          </p>
        </div>

        {/* Period Selector */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-500 sm:w-auto"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Financial Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Revenue</p>

          <h3 className="mt-2 text-xl font-bold text-gray-800">
            {formatCurrency(financialData.revenue)}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Total sales generated
          </p>
        </div>

        {/* Cost */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Cost of Goods Sold</p>

          <h3 className="mt-2 text-xl font-bold text-gray-800">
            {formatCurrency(financialData.cost)}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Cost of products sold
          </p>
        </div>

        {/* Profit */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Gross Profit</p>

          <h3
            className={`mt-2 text-xl font-bold ${
              financialData.profit >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formatCurrency(financialData.profit)}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Revenue minus product costs
          </p>
        </div>

        {/* Margin */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Profit Margin</p>

          <h3
            className={`mt-2 text-xl font-bold ${
              financialData.margin >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {financialData.margin.toFixed(1)}%
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Percentage of revenue kept as profit
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinancialSummary;