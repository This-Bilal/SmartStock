const express = require("express");
const {
  getDashboardSummary,
  getTodaySales,
  getWeeklySales,
  getMonthlySales,
  getBestSellingProducts,
  getLeastSellingProducts,
  getEmployeeDailySales,
} = require("../controller/reportController");
const { authorize, protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/dashBoard", protect, authorize("owner"), getDashboardSummary);
router.get(
  "/employeeDailySales/:employeeId",
  protect,
  authorize("cashier"),
  getEmployeeDailySales,
);
router.get(
  "/todaySales",
  protect,
  authorize("owner", "manager"),
  getTodaySales,
);
router.get(
  "/weeklySales",
  protect,
  authorize("owner", "manager"),
  getWeeklySales,
);
router.get(
  "/monthlySales",
  protect,
  authorize("owner", "manager"),
  getMonthlySales,
);
router.get(
  "/bestSelling",
  protect,
  authorize("owner", "manager"),
  getBestSellingProducts,
);
router.get(
  "/leastSelling",
  protect,
  authorize("owner", "manager"),
  getLeastSellingProducts,
);

module.exports = router;
