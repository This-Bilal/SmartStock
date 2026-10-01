import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import BackButton from "../../../components/other/BackButton";
import { useTitle } from "../../../hooks/useTitile";
import { getSales } from "../../../services/saleService";

const CashierSalesPage = () => {
  useTitle("SmartStock: sales history");

  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch sales
  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSales();
        setSales(data);
      } catch (error) {
        setError(error?.message || "Unable to load sales history.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  // Filter sales
  const filteredSales = sales.filter((sale) => {
    const query = search.trim().toLowerCase();

    const matchesSearch = sale.saleNumber?.toLowerCase().includes(query);

    const saleDate = DateTime.fromFormat(sale.date, "dd LLL yyyy, hh:mm a", {
      zone: "Africa/Lagos",
    });

    const now = DateTime.now().setZone("Africa/Lagos");

    let matchesFilter = true;

    // Daily
    if (filter === "daily") {
      matchesFilter = saleDate.hasSame(now, "day");
    }

    // Weekly
    if (filter === "weekly") {
      const startOfWeek = now.minus({ days: now.weekday % 7 }).startOf("day");

      const endOfWeek = startOfWeek.plus({ days: 6 }).endOf("day");

      matchesFilter = saleDate >= startOfWeek && saleDate <= endOfWeek;
    }

    // Monthly
    if (filter === "monthly") {
      matchesFilter = saleDate.hasSame(now, "month");
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-5">
          <BackButton />
        </div>

        {/* Header */}
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
              Sales History
            </h1>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              View and search through your sales records.
            </p>
          </div>

          {/* Search */}
          <div className="w-full sm:w-72 lg:w-80">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sale number..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* Sales Filter */}
        <div className="mb-5 flex flex-wrap gap-2">
          {[
            { label: "All", value: "all" },
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
            { label: "Monthly", value: "monthly" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
                filter === option.value
                  ? "bg-red-500 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className=" flex flex-col items-center justify-center rounded-2xl py-10 bg-white p-4 shadow-md sm:p-5 lg:p-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Loading sales history...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">
              {search
                ? `No sale found for "${search}".`
                : filter === "daily"
                  ? "No sales recorded today."
                  : filter === "weekly"
                    ? "No sales recorded this week."
                    : filter === "monthly"
                      ? "No sales recorded this month."
                      : "No sales have been recorded yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                      Sale Number
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                      Items
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                      Payment
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="border-b border-gray-100 transition-colors duration-200 hover:bg-gray-50 last:border-b-0"
                    >
                      {/* Sale Number */}
                      <td className="p-0">
                        <Link
                          to={`/sales/${sale.saleNumber}`}
                          className="block px-5 py-4 font-medium text-gray-800"
                        >
                          {sale.saleNumber}
                        </Link>
                      </td>

                      {/* Items */}
                      <td className="p-0">
                        <Link
                          to={`/sales/${sale.saleNumber}`}
                          className="block px-5 py-4 text-sm text-gray-600"
                        >
                          {sale.items?.reduce(
                            (total, item) => total + item.quantity,
                            0,
                          )}
                        </Link>
                      </td>

                      {/* Amount */}
                      <td className="p-0">
                        <Link
                          to={`/sales/${sale.saleNumber}`}
                          className="block px-5 py-4 text-sm font-semibold text-gray-800"
                        >
                          ₦{sale.totalAmount?.toLocaleString()}
                        </Link>
                      </td>

                      {/* Payment */}
                      <td className="p-0">
                        <Link
                          to={`/sales/${sale.saleNumber}`}
                          className="block px-5 py-4"
                        >
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                            {sale.paymentMethod}
                          </span>
                        </Link>
                      </td>

                      {/* Date */}
                      <td className="p-0">
                        <Link
                          to={`/sales/${sale.saleNumber}`}
                          className="block px-5 py-4 text-sm text-gray-500"
                        >
                          {sale.date}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredSales.map((sale) => (
                <Link
                  key={sale.id}
                  to={`/sales/${sale.saleNumber}`}
                  className="block p-4 transition-colors duration-200 hover:bg-gray-50"
                >
                  {/* Sale Number + Payment */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {sale.saleNumber}
                      </p>
                    </div>

                    <span className="whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                      {sale.paymentMethod}
                    </span>
                  </div>

                  {/* Sale Information */}
                  <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                    {/* Amount */}
                    <div>
                      <p className="text-gray-400">Amount</p>

                      <p className="mt-1 font-semibold text-gray-700">
                        ₦{sale.totalAmount?.toLocaleString()}
                      </p>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-gray-400">Items</p>

                      <p className="mt-1 font-medium text-gray-700">
                        {sale.items?.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        )}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-gray-400">Date</p>

                      <p className="mt-1 font-medium text-gray-700">
                        {sale.date}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CashierSalesPage;
