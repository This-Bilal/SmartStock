import React, { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  getMonthlySales,
  getTodaySales,
  getWeeklySales,
} from "../../../services/reportService";

const SalesOverview = () => {
  const [period, setPeriod] = useState("week");
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError("");

        let data;

        if (period === "today") {
          data = await getTodaySales();
        } else if (period === "week") {
          data = await getWeeklySales();
        } else {
          data = await getMonthlySales();
        }

        setSalesData(data);
      } catch (error) {
        setError(error?.message || "Failed to load sales.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [period]);

  const chartData = useMemo(() => {
    if (!salesData?.sales?.length) {
      return [];
    }

    const groupedSales = {};

    salesData.sales.forEach((sale) => {
      const date = DateTime.fromISO(sale.date).setZone("Africa/Lagos");

      let key;

      if (period === "today") {
        key = date.toFormat("HH:00");
      } else {
        key = date.toFormat("dd LLL");
      }

      if (!groupedSales[key]) {
        groupedSales[key] = 0;
      }

      groupedSales[key] += sale.totalAmount || 0;
    });

    return Object.entries(groupedSales)
      .map(([date, revenue]) => ({
        date,
        revenue,
      }))
      .reverse();
  }, [salesData, period]);

  /* LOADING */
  if (loading) {
    return (
      <div className=" flex flex-col items-center justify-center rounded-2xl py-10 bg-white p-4 shadow-md sm:p-5 lg:p-6">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-red-500 border-t-transparent"></div>

        <p className="mt-3 text-xs text-gray-500 sm:text-sm">
          Loading sales overview...
        </p>
      </div>
    );
  }

  /* ERROR */
  if (error) {
    return (
      <div className="w-full rounded-2xl bg-white p-4 shadow-md sm:p-5 lg:p-6">
        <p className="text-xs text-red-500 sm:text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-md sm:p-5 lg:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
            Sales Overview
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Monitor your sales performance
          </p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="w-full rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 outline-none sm:w-auto sm:text-sm"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* SUMMARY */}
      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        {/* REVENUE */}
        <div className="min-w-0">
          <p className="text-xs text-gray-500 sm:text-sm">Total Revenue</p>

          <h3 className="mt-1 wrap-break-word text-xl font-bold text-gray-800 xs:text-2xl sm:text-3xl">
            ₦{(salesData?.totalRevenue ?? 0).toLocaleString()}
          </h3>
        </div>

        {/* TOTAL SALES */}
        <div className="sm:text-right">
          <p className="text-xs text-gray-500 sm:text-sm">Total Sales</p>

          <p className="text-lg font-semibold text-gray-800 sm:text-xl">
            {salesData?.totalSales ?? 0}
          </p>
        </div>
      </div>

      {/* CHART */}
      <div className="mt-6 h-52 sm:mt-8 sm:h-64">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <p className="text-xs text-gray-400 sm:text-sm">
              No sales recorded for this period.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `₦${value.toLocaleString()}`}
              />

              <Tooltip
                formatter={(value) => [`₦${value.toLocaleString()}`, "Revenue"]}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesOverview;
