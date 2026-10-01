import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInventoryHistory } from "../../../services/inventoryService";

const StockMovement = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getInventoryHistory();

        setMovements(data);
      } catch (error) {
        setError(error?.message || "Failed to load stock movements.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      {/* HEADER */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Stock Movement
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Recent inventory activity
          </p>
        </div>

        {/* ICON */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-lg bg-gray-100 text-gray-600 sm:self-auto">
          <span className="text-sm font-semibold">↕</span>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className=" flex flex-col items-center justify-center rounded-2xl py-10 bg-white p-4 shadow-md sm:p-5 lg:p-6">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

          <p className="mt-3 text-xs text-gray-500 sm:text-sm">
            Loading stock movement...
          </p>
        </div>
      ) : error ? (
        <div className="px-4 py-10 text-center sm:px-5">
          <p className="text-xs text-red-500 sm:text-sm">{error}</p>
        </div>
      ) : movements.length === 0 ? (
        <div className="px-4 py-10 text-center sm:px-5">
          <p className="text-xs text-gray-500 sm:text-sm">
            No stock movement found.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {movements.slice(0, 4).map((movement) => {
            const isStockIn = movement.movementType === "stock_in";

            return (
              <div
                key={movement.id}
                className="flex flex-col gap-3 px-4 py-4 transition-all duration-200 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5"
              >
                {/* PRODUCT INFORMATION */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {movement.productName}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-400">
                    {movement.productSku}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {movement.reason}
                  </p>
                </div>

                {/* MOVEMENT INFORMATION */}
                <div className="flex shrink-0 items-center justify-between gap-4 sm:block sm:text-right">
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        isStockIn
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {isStockIn ? "Stock In" : "Stock Out"}
                    </span>
                  </div>

                  <div className="text-right">
                    <p
                      className={`mt-0 text-sm font-semibold sm:mt-1 ${
                        isStockIn ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isStockIn ? "+" : "-"}
                      {movement.quantity}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      {movement.date}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW ALL */}
      {!loading && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 sm:px-5">
          <Link
            to="/inventoryHistory"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-center text-xs font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100 sm:px-4 sm:text-sm"
          >
            View All
          </Link>
        </div>
      )}
    </section>
  );
};

export default StockMovement;
