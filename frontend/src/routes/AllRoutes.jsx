import React from "react";
import { Route, Routes } from "react-router-dom";
import LowStock from "../pages/product/LowStock";
import OutOfStock from "../pages/product/OutOfStock";
import CartPage from "../pages/cart/CartPage";
import Category from "../pages/category/Category";
import EmployeeList from "../pages/employee/EmployeeList";
import InventoryHistory from "../pages/inventory/InventoryHistory";
import ProductList from "../pages/product/ProductList";
import ProductDetails from "../pages/product/ProductDetails";
import SalesPage from "../pages/sales/SalesPage";
import SaleDetails from "../pages/sales/SaleDetails";
import Register from "../pages/Register";
import Login from "../pages/Login";
import OwnerProfile from "../pages/owner/OwnerProfile";
import LandingPage from "../pages/landing page/LandingPage";
import OwnerHomePage from "../pages/owner/OwnerHomePage";
import CashierHomepage from "../pages/cahier/CashierHomepage";
import ReportsPage from "../pages/reports/ReportsPage";
import UpdateEmployee from "../pages/employee/UpdateEmployee";
import CreateEmployee from "../pages/employee/CreateEmployee";
import ProductPerformancePage from "../pages/reports/productPerformancePage";
import ProfitAnalysisPage from "../pages/reports/ProfitAnalysisPage";
import UpdateOwnerProfile from "../pages/owner/components/UpdateOwnerProfile";
import ChangeEmail from "../pages/owner/components/ChangeEmail";
import ChangePassword from "../pages/owner/components/ChangePassword";
import ManagerHomapage from "../pages/manager/ManagerHomapage";
import UpdateCategory from "../pages/category/components/UpdateCategory";
import CreateCategory from "../pages/category/components/CreateCategory";
import AddStock from "../pages/inventory/AddStock";
import ManagerProductList from "../pages/product/ManagerProductList";
import ManagerInventoryStatus from "../pages/manager/ManagerInventoryStatus";
import UpdateProduct from "../pages/product/UpdateProduct";
import RemoveStock from "../pages/inventory/RemoveStock";
import CreateProduct from "../pages/product/CreateProduct";
import CashierSalesPage from "../pages/cahier/component/CashierSalesPage";
import CashierProductList from "../pages/product/CashierProductList";
import SubscriptionPage from "../pages/subscription/SubscriptionPage";
import PaymentCallback from "../pages/PaymentCallback";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/ownerhomepage" element={<OwnerHomePage />} />
      <Route path="/cashierhomepage" element={<CashierHomepage />} />
      <Route path="/managerhomepage" element={<ManagerHomapage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/category" element={<Category />} />
      <Route path="/employeeList" element={<EmployeeList />} />
      <Route path="/inventoryHistory" element={<InventoryHistory />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/lowstock" element={<LowStock />} />
      <Route path="/outofstock" element={<OutOfStock />} />
      <Route path="/salespage" element={<SalesPage />} />
      <Route path="/sales/:saleNumber" element={<SaleDetails />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/ownerprofile" element={<OwnerProfile />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/updateEmployee/:employeeId" element={<UpdateEmployee />} />
      <Route path="/createEmployee" element={<CreateEmployee />} />
      <Route
        path="/productPerformancePage"
        element={<ProductPerformancePage />}
      />
      <Route path="/ProfitAnalysisPage" element={<ProfitAnalysisPage />} />
      <Route path="/updateOwnerProfile" element={<UpdateOwnerProfile />} />
      <Route path="/changeEmail" element={<ChangeEmail />} />
      <Route path="/changePassword" element={<ChangePassword />} />
      <Route path="/updateCategory/:categoryId" element={<UpdateCategory />} />
      <Route path="/createCategory" element={<CreateCategory />} />
      <Route path="/addStock/:productId" element={<AddStock />} />
      <Route path="/removeStock/:productId" element={<RemoveStock />} />
      <Route path="/managerProductList" element={<ManagerProductList />} />
      <Route
        path="/managerInventoryStatus"
        element={<ManagerInventoryStatus />}
      />
      <Route path="/updateProduct/:productId" element={<UpdateProduct />} />
      <Route path="/createProduct" element={<CreateProduct />} />
      <Route path="/cashierSalesPage" element={<CashierSalesPage />} />
      <Route path="/cashierProductList" element={<CashierProductList />} />
      <Route path="/subscriptionPage" element={<SubscriptionPage />} />
      <Route path="/payment/callback" element={<PaymentCallback />} />
    </Routes>
  );
};

export default AllRoutes;
