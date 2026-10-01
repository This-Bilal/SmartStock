import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  getLowStockProducts,
  getOutOfStockProducts,
} from "../../services/productService";
import { getTodaySales } from "../../services/reportService";
import { useTitle } from "../../hooks/useTitile";
import ManagerDashboard from "./component/ManagerDashboard";
import SalesOverview from "../owner/components/SalesOverview";
import RecentSales from "../owner/components/RecentSales";
import ManagerQuickActions from "./component/ManagerQuickActions";
import ManagerInventoryStatus from "./ManagerInventoryStatus";
import { getAnEmployee } from "../../services/employeeService";

const ManagerHomePage = () => {
  useTitle("SmartStock: manager's page");

  const [manager, setManager] = useState(null);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);

  const [loadingManager, setLoadingManager] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingLowStock, setLoadingLowStock] = useState(true);
  const [loadingOutOfStock, setLoadingOutOfStock] = useState(true);

  // GET LOGGED-IN MANAGER
  useEffect(() => {
    const fetchManager = async () => {
      try {
        setLoadingManager(true);

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          return;
        }

        const user = JSON.parse(storedUser);

        if (!user?.id) {
          return;
        }

        const data = await getAnEmployee(user.id);
        setManager(data);
      } catch (error) {
        console.error("Failed to fetch manager:", error);
      } finally {
        setLoadingManager(false);
      }
    };

    fetchManager();
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

  // GET TODAY'S SALES
  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoadingSales(true);

        const data = await getTodaySales();

        // Store only the sales array
        setSales(data?.sales || []);
      } catch (error) {
        console.error("Failed to fetch today's sales:", error);
      } finally {
        setLoadingSales(false);
      }
    };

    fetchSales();
  }, []);

  // GET LOW STOCK PRODUCTS
  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        setLoadingLowStock(true);

        const data = await getLowStockProducts();
        setLowStock(data);
      } catch (error) {
        console.error("Failed to fetch low stock products:", error);
      } finally {
        setLoadingLowStock(false);
      }
    };

    fetchLowStock();
  }, []);

  // GET OUT OF STOCK PRODUCTS
  useEffect(() => {
    const fetchOutOfStock = async () => {
      try {
        setLoadingOutOfStock(true);

        const data = await getOutOfStockProducts();
        setOutOfStock(data);
      } catch (error) {
        console.error("Failed to fetch out of stock products:", error);
      } finally {
        setLoadingOutOfStock(false);
      }
    };

    fetchOutOfStock();
  }, []);

  // CALCULATE TOTAL STOCK
  const totalStock = products.reduce(
    (total, product) =>
      product?.isActive ? total + (product?.quantity || 0) : total,
    0,
  );

  // AVAILABLE PRODUCTS
  const availableProducts = products.filter((product) => product.quantity > 0);

  return (
    <main className="w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl">
        {/* GREETING AND SUMMARY CARDS */}
        <ManagerDashboard
          manager={manager}
          products={products}
          totalStock={totalStock}
          lowStock={lowStock}
          outOfStock={outOfStock}
          loadingManager={loadingManager}
          loadingProducts={loadingProducts}
          loadingLowStock={loadingLowStock}
          loadingOutOfStock={loadingOutOfStock}
        />

        {/* SALES OVERVIEW + INVENTORY STATUS */}
        <section id="sales-inventory" className="w-full px-5 pb-10">
          <div className="flex w-full flex-col gap-6 lg:flex-row">
            {/* SALES OVERVIEW */}
            <div className="w-full lg:w-2/3">
              <SalesOverview />
            </div>

            {/* INVENTORY STATUS */}
            <ManagerInventoryStatus
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
            <ManagerQuickActions />
          </div>
        </section>
      </div>
    </main>
  );
};

export default ManagerHomePage;
