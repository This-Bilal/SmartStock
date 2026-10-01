const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Employee = require("../models/employeeModel");
const Sale = require("../models/saleModel");
const { DateTime } = require("luxon");

const getDashboardSummary = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  // Nigeria (WAT) start and end of today
  const startOfToday = DateTime.now().setZone("Africa/Lagos").startOf("day");

  const startOfTomorrow = startOfToday.plus({
    days: 1,
  });

  // Convert to UTC for MongoDB
  const today = startOfToday.toUTC().toJSDate();
  const tomorrow = startOfTomorrow.toUTC().toJSDate();

  const [
    totalProducts,
    activeProducts,
    inactiveProducts,
    totalEmployees,
    activeEmployees,
    totalSales,
    lowStockProducts,
    outOfStockProducts,
    todaySales,
    totalRevenue,
    todayRevenue,
  ] = await Promise.all([
    Product.countDocuments({
      owner: ownerId,
    }),

    Product.countDocuments({
      owner: ownerId,
      isActive: true,
    }),

    Product.countDocuments({
      owner: ownerId,
      isActive: false,
    }),

    Employee.countDocuments({
      owner: ownerId,
    }),

    Employee.countDocuments({
      owner: ownerId,
      isActive: true,
    }),

    Sale.countDocuments({
      owner: ownerId,
      status: "completed",
    }),

    Product.countDocuments({
      owner: ownerId,
      $expr: {
        $lte: ["$quantity", "$lowStockLimit"],
      },
    }),

    Product.countDocuments({
      owner: ownerId,
      quantity: 0,
    }),

    // Today's sales (WAT)
    Sale.countDocuments({
      owner: ownerId,
      status: "completed",
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    }),

    // Total revenue
    Sale.aggregate([
      {
        $match: {
          owner: ownerId,
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]),

    // Today's revenue (WAT)
    Sale.aggregate([
      {
        $match: {
          owner: ownerId,
          status: "completed",
          createdAt: {
            $gte: today,
            $lt: tomorrow,
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]),
  ]);

  res.status(200).json({
    products: {
      total: totalProducts,
      active: activeProducts,
      inactive: inactiveProducts,
      lowStock: lowStockProducts,
      outOfStock: outOfStockProducts,
    },

    employees: {
      total: totalEmployees,
      active: activeEmployees,
      inactive: totalEmployees - activeEmployees,
    },

    sales: {
      total: totalSales,
      today: todaySales,
    },

    revenue: {
      total: totalRevenue.length > 0 ? totalRevenue[0].revenue : 0,

      today: todayRevenue.length > 0 ? todayRevenue[0].revenue : 0,
    },

    date: startOfToday.toFormat("yyyy-MM-dd"),
  });
});

const getEmployeeDailySales = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  if (!employeeId) {
    return res.status(400).json({
      message: "Employee ID is required.",
    });
  }

  const startOfToday = DateTime.now().setZone("Africa/Lagos").startOf("day");

  const endOfToday = startOfToday.endOf("day");

  const sales = await Sale.find({
    owner: ownerId,
    employee: employeeId,
    status: "completed",
    createdAt: {
      $gte: startOfToday.toUTC().toJSDate(),
      $lte: endOfToday.toUTC().toJSDate(),
    },
  })
    .populate("employee", "name email role")
    .sort({ createdAt: -1 });

  const totalRevenue = sales.reduce(
    (total, sale) => total + sale.totalAmount,
    0,
  );

  res.status(200).json({
    totalSales: sales.length,
    totalRevenue,
    date: startOfToday.toFormat("yyyy-MM-dd"),
    sales,
  });
});

const getTodaySales = asyncHandler(async (req, res) => {
  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  // Nigeria (WAT) start and end of today
  const startOfToday = DateTime.now().setZone("Africa/Lagos").startOf("day");

  const endOfToday = startOfToday.endOf("day");

  // Convert to UTC JavaScript Date objects for MongoDB
  const today = startOfToday.toUTC().toJSDate();
  const tomorrow = endOfToday.toUTC().toJSDate();

  // Get today's sales
  const sales = await Sale.find({
    owner: ownerId,
    status: "completed",
    createdAt: {
      $gte: today,
      $lte: tomorrow,
    },
  })
    .populate("employee", "name email")
    .sort({ createdAt: -1 });

  // Calculate today's revenue
  const revenue = sales.reduce((total, sale) => total + sale.totalAmount, 0);

  res.status(200).json({
    totalSales: sales.length,
    totalRevenue: revenue,
    date: startOfToday.toFormat("yyyy-MM-dd"),
    sales,
  });
});

const getWeeklySales = asyncHandler(async (req, res) => {
  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  // Nigeria (WAT): current week runs Sunday - Saturday
  const now = DateTime.now().setZone("Africa/Lagos");

  const startOfWeek = now.minus({ days: now.weekday % 7 }).startOf("day");

  const endOfWeek = startOfWeek.plus({ days: 6 }).endOf("day");

  // Convert to UTC JavaScript Date objects for MongoDB
  const weekStart = startOfWeek.toUTC().toJSDate();
  const weekEnd = endOfWeek.toUTC().toJSDate();

  const sales = await Sale.find({
    owner: ownerId,
    status: "completed",
    createdAt: {
      $gte: weekStart,
      $lte: weekEnd,
    },
  })
    .populate("employee", "name email")
    .sort({ createdAt: -1 });

  const revenue = sales.reduce((total, sale) => total + sale.totalAmount, 0);

  res.status(200).json({
    totalSales: sales.length,
    totalRevenue: revenue,
    weekStart: startOfWeek.toFormat("yyyy-MM-dd"),
    weekEnd: endOfWeek.toFormat("yyyy-MM-dd"),
    sales,
  });
});

const getMonthlySales = asyncHandler(async (req, res) => {
  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  // Current month in Nigeria (WAT)
  const startOfMonth = DateTime.now().setZone("Africa/Lagos").startOf("month");

  // End of current month in Nigeria (WAT)
  const endOfMonth = startOfMonth.endOf("month");

  // Convert to UTC for MongoDB query
  const monthStart = startOfMonth.toUTC().toJSDate();
  const monthEnd = endOfMonth.toUTC().toJSDate();

  const sales = await Sale.find({
    owner: ownerId,
    status: "completed",
    createdAt: {
      $gte: monthStart,
      $lte: monthEnd,
    },
  })
    .populate("employee", "name email")
    .sort({ createdAt: -1 });

  const revenue = sales.reduce((total, sale) => total + sale.totalAmount, 0);

  res.status(200).json({
    totalSales: sales.length,
    totalRevenue: revenue,

    month: startOfMonth.toFormat("LLLL yyyy"),

    monthStart: startOfMonth.toFormat("yyyy-MM-dd"),
    monthEnd: endOfMonth.toFormat("yyyy-MM-dd"),
    sales,
  });
});

const getBestSellingProducts = asyncHandler(async (req, res) => {
  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  const bestSellingProducts = await Sale.aggregate([
    {
      $match: {
        owner: ownerId,
        status: "completed",
      },
    },

    {
      $unwind: "$items",
    },

    {
      $group: {
        _id: "$items.product",

        productName: {
          $first: "$items.productName",
        },

        sku: {
          $first: "$items.sku",
        },

        totalQuantitySold: {
          $sum: "$items.quantity",
        },

        totalRevenue: {
          $sum: "$items.subtotal",
        },
      },
    },

    {
      $sort: {
        totalQuantitySold: -1,
      },
    },
  ]);

  res.status(200).json(bestSellingProducts);
});

const getLeastSellingProducts = asyncHandler(async (req, res) => {
  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;
  const leastSellingProducts = await Sale.aggregate([
    {
      $match: {
        owner: ownerId,
        status: "completed",
      },
    },

    {
      $unwind: "$items",
    },

    {
      $group: {
        _id: "$items.product",

        productName: {
          $first: "$items.productName",
        },

        sku: {
          $first: "$items.sku",
        },

        totalQuantitySold: {
          $sum: "$items.quantity",
        },

        totalRevenue: {
          $sum: "$items.subtotal",
        },
      },
    },

    {
      $sort: {
        totalQuantitySold: 1,
      },
    },
  ]);

  res.status(200).json(leastSellingProducts);
});

module.exports = {
  getDashboardSummary,
  getTodaySales,
  getWeeklySales,
  getMonthlySales,
  getBestSellingProducts,
  getLeastSellingProducts,
  getEmployeeDailySales,
};
