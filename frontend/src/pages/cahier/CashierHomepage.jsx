import React, { useEffect, useState } from "react";
import { getEmployeeDailySales } from "../../services/reportService";
import { getAnEmployee } from "../../services/employeeService";
import { useTitle } from "../../hooks/useTitile";
import CashierDashboard from "./component/CashierDashboard";
import CashierRecentSales from "./component/CashierRecentSales";
import CashierQuickAction from "./component/CashierQuickAction";

const CashierHomepage = () => {
  const [cashier, setCashier] = useState(null);
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useTitle("SmartStock: cashier homepage");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setError("User information not found.");
          return;
        }

        const user = JSON.parse(storedUser);

        if (!user?.id) {
          setError("User information is incomplete.");
          return;
        }

        const cashierData = await getAnEmployee(user.id);
        const salesData = await getEmployeeDailySales(user.id);

        setCashier(cashierData);
        setSales(salesData);
      } catch (error) {
        console.error("Failed to fetch cashier data:", error);
        setError(error?.message || "Failed to load cashier data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalQuantity =
    sales?.sales?.reduce(
      (total, sale) =>
        total +
        sale.items.reduce(
          (itemTotal, item) => itemTotal + item.quantity,
          0
        ),
      0
    ) || 0;

  const totalSales = sales?.totalSales || 0;

  return (
    <main className="w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl">

        {/* GREETING AND SUMMARY CARDS */}
        <CashierDashboard
          cashier={cashier}
          sales={sales}
          totalSales={totalSales}
          itemsSold={totalQuantity}
          loading={loading}
        />

        {/* RECENT SALES + QUICK ACTIONS */}
        <section className="flex w-full flex-col gap-6 px-5 py-10 lg:flex-row">

          {/* RECENT SALES */}
          <div className="w-full lg:w-1/2">
            <CashierRecentSales
              sales={sales?.sales || []}
              loading={loading}
              error={error}
            />
          </div>

          {/* QUICK ACTIONS */}
          <div className="w-full lg:w-1/2">
            <CashierQuickAction />
          </div>

        </section>
      </div>
    </main>
  );
};

export default CashierHomepage;