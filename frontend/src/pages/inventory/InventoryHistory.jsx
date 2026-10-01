import React, { useEffect, useState } from "react";
import { getInventoryHistory } from "../../services/inventoryService";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";

const InventoryHistory = () => {
  useTitle("SmartStock: inventory history");

  const [movements, setMovements] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getInventoryHistory();

        setMovements(data);
      } catch (error) {
        if (error?.response?.status === 403) {
          setAccessDenied(true);
        } else {
          setError(
            error?.message ||
              "Failed to load inventory history.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Filter movements by date
  const filteredMovements = movements.filter((movement) => {
    const query = searchDate
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

    if (!query) return true;

    const movementDate = movement.date
      ?.toLowerCase()
      .replace(/\s+/g, " ");

    return movementDate?.includes(query);
  });

  return (
    <main className="min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 sm:py-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-5">
          <BackButton />
        </div>

        {/* Page Header */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Inventory History
          </h1>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            View all stock movements and inventory activities.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 py-10 shadow-md sm:p-5 lg:p-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Loading inventory history...
            </p>
          </div>
        )}

        {/* Subscription Access Denied */}
        {!loading && accessDenied && (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-10 text-center shadow-md sm:px-8 sm:py-14">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl text-red-600">
              🔒
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-800 sm:text-xl">
              Inventory History is not available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-gray-500 sm:text-sm">
              Your current subscription plan does not include
              inventory history. Upgrade your plan to access
              this feature.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/subscription";
              }}
              className="mt-6 rounded-lg bg-red-700 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-red-800 sm:text-sm"
            >
              View Subscription Plans
            </button>
          </div>
        )}

        {/* Normal Error */}
        {!loading && !accessDenied && error && (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-9 text-center text-xs text-red-500 shadow-sm sm:px-5 sm:py-12 sm:text-sm">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !accessDenied &&
          !error &&
          movements.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-9 text-center text-xs text-gray-500 shadow-sm sm:px-5 sm:py-12 sm:text-sm">
              No inventory history found.
            </div>
          )}

        {/* Inventory History */}
        {!loading &&
          !accessDenied &&
          !error &&
          movements.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:shadow-md">
              {/* Table Header */}
              <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                    Stock Movements
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    {filteredMovements.length}{" "}
                    {filteredMovements.length === 1
                      ? "movement"
                      : "movements"}{" "}
                    found
                  </p>
                </div>

                {/* Date Search */}
                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    value={searchDate}
                    onChange={(e) =>
                      setSearchDate(e.target.value)
                    }
                    placeholder="Search by date e.g. 01 Sep 2026"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-xs text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 sm:text-sm"
                  />
                </div>
              </div>

              {/* No Search Results */}
              {filteredMovements.length === 0 ? (
                <div className="px-4 py-10 text-center sm:px-5 sm:py-12">
                  <p className="text-xs text-gray-500 sm:text-sm">
                    No inventory movement found for "
                    {searchDate}".
                  </p>
                </div>
              ) : (
                /* Table */
                <div className="overflow-x-auto">
                  <table className="w-full min-w-275 text-left text-xs sm:text-sm">
                    <thead className="border-b border-gray-100 bg-gray-50">
                      <tr>
                        <th className="whitespace-nowrap px-3 py-3 font-semibold text-gray-600 sm:px-5 sm:py-3.5">
                          Product
                        </th>
                        <th className="whitespace-nowrap px-3 py-3 font-semibold text-gray-600 sm:px-5 sm:py-3.5">
                          Movement
                        </th>
                        <th className="whitespace-nowrap px-3 py-3 font-semibold text-gray-600 sm:px-5 sm:py-3.5">
                          Quantity
                        </th>
                        <th className="whitespace-nowrap px-3 py-3 font-semibold text-gray-600 sm:px-5 sm:py-3.5">
                          Stock Change
                        </th>
                        <th className="whitespace-nowrap px-3 py-3 font-semibold text-gray-600 sm:px-5 sm:py-3.5">
                          Reason
                        </th>
                        <th className="whitespace-nowrap px-3 py-3 font-semibold text-gray-600 sm:px-5 sm:py-3.5">
                          Employee
                        </th>
                        <th className="whitespace-nowrap px-3 py-3 font-semibold text-gray-600 sm:px-5 sm:py-3.5">
                          Sale
                        </th>
                        <th className="whitespace-nowrap px-3 py-3 font-semibold text-gray-600 sm:px-5 sm:py-3.5">
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredMovements.map((movement) => {
                        const isStockIn =
                          movement.movementType === "stock_in";

                        return (
                          <tr
                            key={movement.id}
                            className="transition duration-150 hover:bg-gray-50"
                          >
                            {/* Product */}
                            <td className="px-3 py-3 sm:px-5 sm:py-4">
                              <div className="min-w-32 sm:min-w-37.5">
                                <p className="font-medium text-gray-800">
                                  {movement.productName ||
                                    "Unknown Product"}
                                </p>

                                <p className="mt-0.5 text-[11px] text-gray-400 sm:mt-1 sm:text-xs">
                                  {movement.productSku || "—"}
                                </p>
                              </div>
                            </td>

                            {/* Movement */}
                            <td className="px-3 py-3 sm:px-5 sm:py-4">
                              <span
                                className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-medium sm:px-2.5 sm:py-1 sm:text-xs ${
                                  isStockIn
                                    ? "bg-green-50 text-green-600"
                                    : "bg-red-50 text-red-600"
                                }`}
                              >
                                {isStockIn
                                  ? "Stock In"
                                  : "Stock Out"}
                              </span>
                            </td>

                            {/* Quantity */}
                            <td className="whitespace-nowrap px-3 py-3 sm:px-5 sm:py-4">
                              <span
                                className={`font-semibold ${
                                  isStockIn
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {isStockIn ? "+" : "-"}
                                {movement.quantity}
                              </span>
                            </td>

                            {/* Stock Change */}
                            <td className="whitespace-nowrap px-3 py-3 sm:px-5 sm:py-4">
                              <span className="text-gray-600">
                                {movement.previousStock}
                              </span>

                              <span className="mx-1.5 text-gray-300 sm:mx-2">
                                →
                              </span>

                              <span className="font-medium text-gray-700">
                                {movement.currentStock}
                              </span>
                            </td>

                            {/* Reason */}
                            <td className="max-w-xs px-3 py-3 sm:px-5 sm:py-4">
                              <p
                                className="truncate text-gray-600"
                                title={movement.reason || ""}
                              >
                                {movement.reason || "—"}
                              </p>
                            </td>

                            {/* Employee */}
                            <td className="px-3 py-3 sm:px-5 sm:py-4">
                              <div className="min-w-25 sm:min-w-30">
                                <p className="font-medium text-gray-700">
                                  {movement.employeeName || "—"}
                                </p>

                                <p className="mt-0.5 text-[11px] capitalize text-gray-400 sm:mt-1 sm:text-xs">
                                  {movement.employeeRole || "—"}
                                </p>
                              </div>
                            </td>

                            {/* Sale */}
                            <td className="whitespace-nowrap px-3 py-3 text-gray-600 sm:px-5 sm:py-4">
                              {movement.saleNumber || "—"}
                            </td>

                            {/* Date */}
                            <td className="whitespace-nowrap px-3 py-3 text-gray-500 sm:px-5 sm:py-4">
                              {movement.date}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Footer */}
              <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 sm:px-5 sm:py-3">
                <p className="text-[11px] text-gray-400 sm:text-xs">
                  {searchDate
                    ? `Showing movements matching "${searchDate}"`
                    : "Showing all inventory movements"}
                </p>
              </div>
            </div>
          )}
      </div>
    </main>
  );
};

export default InventoryHistory;