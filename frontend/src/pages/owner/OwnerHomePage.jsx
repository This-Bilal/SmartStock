import React, { useEffect, useState } from "react";
import { getOwnerProfile } from "../../services/ownerService";
import {
  getAllProducts,
  getLowStockProducts,
  getOutOfStockProducts,
} from "../../services/productService";
import { getTodaySales } from "../../services/reportService";
import { getAllEmployee } from "../../services/employeeService";
import SalesOverview from "./components/SalesOverview";
import { useTitle } from "../../hooks/useTitile";
import RecentSales from "./components/RecentSales";
import QuickActions from "./components/QuickActions";
import DashboardSummary from "./components/DashboardSummary";
import InventoryStatus from "./components/InventoryStatus";

const OwnerHomePage = () => {
  useTitle("SmartStock: owner's page");

  const [owner, setOwner] = useState(null);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [report, setReport] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [lowStock, setLowstock] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);

  const [loadingOwner, setLoadingOwner] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingLowStock, setLoadingLowStock] = useState(true);
  const [loadingOutOfStock, setLoadingOutOfStock] = useState(true);

  // GET OWNER
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        setLoadingOwner(true);

        const data = await getOwnerProfile();
        setOwner(data);
      } catch (error) {
        console.error("Failed to fetch owner:", error);
      } finally {
        setLoadingOwner(false);
      }
    };

    fetchOwner();
  }, []);

  // GET PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // GET TODAY'S SALES / REPORT
  useEffect(() => {
    const fetchTodaySales = async () => {
      try {
        setLoadingSales(true);

        const data = await getTodaySales();

        setReport(data);
        setSales(data?.sales || []);
      } catch (error) {
        console.error("Failed to fetch today's sales:", error);
      } finally {
        setLoadingSales(false);
      }
    };

    fetchTodaySales();
  }, []);

  // GET EMPLOYEES
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);

        const data = await getAllEmployee();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  // GET LOW STOCK PRODUCTS
  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        setLoadingLowStock(true);

        const data = await getLowStockProducts();
        setLowstock(data);
      } catch (error) {
        console.error("Failed to fetch low-stock products:", error);
      } finally {
        setLoadingLowStock(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  // GET OUT OF STOCK PRODUCTS
  useEffect(() => {
    const fetchOutOfStockProducts = async () => {
      try {
        setLoadingOutOfStock(true);

        const data = await getOutOfStockProducts();
        setOutOfStock(data);
      } catch (error) {
        console.error("Failed to fetch out-of-stock products:", error);
      } finally {
        setLoadingOutOfStock(false);
      }
    };

    fetchOutOfStockProducts();
  }, []);

  // AVAILABLE PRODUCTS
  const availableProducts = products.filter((product) => product.quantity > 0);

  // ACTIVE EMPLOYEES
  const activeEmployees = employees.filter(
    (employee) => employee.isActive,
  ).length;

  return (
    <main className="w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl">
        {/* GREETING AND MINI CARDS */}
        <DashboardSummary
          owner={owner}
          products={products}
          sales={sales}
          report={report}
          activeEmployees={activeEmployees}
          loadingOwner={loadingOwner}
          loadingProducts={loadingProducts}
          loadingSales={loadingSales}
          loadingEmployees={loadingEmployees}
        />

        {/* SALES OVERVIEW + INVENTORY STATUS */}
        <section id="sales-inventory" className="w-full px-5 pb-10">
          <div className="flex w-full flex-col gap-6 lg:flex-row">
            {/* SALES OVERVIEW */}
            <div className="w-full lg:w-2/3">
              <SalesOverview />
            </div>

            {/* INVENTORY STATUS */}
            <InventoryStatus
              availableProducts={availableProducts}
              lowStock={lowStock}
              outOfStock={outOfStock}
              loadingProducts={loadingProducts}
              loadingLowStock={loadingLowStock}
              loadingOutOfStock={loadingOutOfStock}
            />
          </div>
        </section>

        {/* RECENT SALES + QUICK ACTIONS */}
        <section
          id="recent-sales"
          className="flex w-full flex-col gap-6 px-5 py-10 lg:flex-row"
        >
          {/* RECENT SALES */}
          <div className="w-full lg:w-1/2">
            <RecentSales sales={sales} loading={loadingSales} />
          </div>

          {/* QUICK ACTIONS */}
          <div className="w-full lg:w-1/2">
            <QuickActions />
          </div>
        </section>
      </div>
    </main>
  );
};

export default OwnerHomePage;
