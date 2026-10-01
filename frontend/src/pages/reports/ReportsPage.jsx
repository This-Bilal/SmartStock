import React, { useEffect, useState } from "react";
import FinancialSummary from "./component/FinancialSummary";
import {
  getTodaySales,
  getWeeklySales,
  getMonthlySales,
} from "../../services/reportService";
import ProfitAnalysis from "./component/ProfitAnalysis";
import ProductPerformance from "./component/ProductPerformance";
import { getAllProducts } from "../../services/productService";
import InventoryOverview from "./component/InventoryOverview";
import StockMovement from "./component/StockMovement";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";

const ReportsPage = () => {
  useTitle("SmartStock: reports");

  const [todaySales, setTodaySales] = useState(null);
  const [weeklySales, setWeeklySales] = useState(null);
  const [monthlySales, setMonthlySales] = useState(null);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        const [today, weekly, monthly, productList] = await Promise.all([
          getTodaySales(),
          getWeeklySales(),
          getMonthlySales(),
          getAllProducts(),
        ]);

        setTodaySales(today);
        setWeeklySales(weekly);
        setMonthlySales(monthly);
        setProducts(productList);
      } catch (error) {
        setError(error?.message || "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <main className="min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* BACK BUTTON */}
        <div className="mb-5 sm:mb-6">
          <BackButton />
        </div>

        {/* PAGE HEADER */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-2 sm:gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl">
                Reports
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm md:text-base">
                View your business performance and inventory insights.
              </p>
            </div>
          </div>
        </div>

        {/* REPORT CONTENT */}
        <div className="space-y-5 sm:space-y-6 md:space-y-7">
          {/* LOADING */}
          {loading && (
            <div className=" flex flex-col items-center justify-center rounded-2xl py-10 bg-white p-4 shadow-md sm:p-5 lg:p-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Loading reports...
            </p>
          </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5 md:p-6">
              <p className="text-xs text-red-500 sm:text-sm md:text-base">
                {error}
              </p>
            </div>
          )}

          {/* FINANCIAL SUMMARY */}
          {!loading && !error && (
            <FinancialSummary
              todaySales={todaySales}
              weeklySales={weeklySales}
              monthlySales={monthlySales}
            />
          )}

          {/* PROFIT ANALYSIS */}
          {!loading && !error && (
            <ProfitAnalysis
              todaySales={todaySales}
              weeklySales={weeklySales}
              monthlySales={monthlySales}
            />
          )}

          {/* PRODUCT PERFORMANCE */}
          {!loading && !error && (
            <ProductPerformance
              todaySales={todaySales}
              weeklySales={weeklySales}
              monthlySales={monthlySales}
            />
          )}

          {/* INVENTORY OVERVIEW */}
          {!loading && !error && <InventoryOverview products={products} />}

          {/* STOCK MOVEMENT */}
          {!loading && !error && <StockMovement />}

          {/* EMPLOYEE ACTIVITY */}
        </div>
      </div>
    </main>
  );
};

export default ReportsPage;
