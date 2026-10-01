import { Link } from "react-router-dom";

const CashierRecentSales = ({ sales = [], loading, error }) => {
  const recentSales = sales.slice(0, 4);

  return (
    <div className="w-full rounded-xl bg-white p-3 shadow-md sm:p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
          Recent Sales
        </h2>

        <Link
          to="/cashierSalesPage"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 sm:text-sm"
        >
          View all
        </Link>
      </div>

      {loading ? (
          <div className=" flex flex-col items-center justify-center rounded-2xl py-10 sm:p-5 lg:p-6">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-red-500 border-t-transparent"></div>

          <p className="mt-3 text-xs text-gray-500 sm:text-sm">
            Loading recent sales...
          </p>
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : recentSales.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {recentSales.map((sale) => (
            <Link
              key={sale.id}
              to={`/sales/${sale.saleNumber}`}
              className="flex items-center justify-between gap-3 py-3 transition-colors duration-200 hover:bg-gray-50 sm:py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800 sm:text-base">
                  Sale #{sale.saleNumber}
                </p>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  {sale.date} · {sale.paymentMethod}
                </p>
              </div>

              <p className="shrink-0 text-sm font-bold text-gray-800 sm:text-base">
                ₦{sale.totalAmount?.toLocaleString() || 0}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">No sales yet.</p>
        </div>
      )}
    </div>
  );
};

export default CashierRecentSales;
