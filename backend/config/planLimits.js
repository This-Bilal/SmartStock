const PLAN_LIMITS = {
  free: {
    name: "Free",
    price: 0,
    description: "For businesses getting started with SmartStock.",

    maxProducts: 20,
    maxEmployees: 2,

    advancedReports: true,
    saleDetails: false,
    inventoryHistory: false,
  },

  basic: {
    name: "Basic",
    price: 1500,
    description:
      "For businesses that need more capabilities beyond the free plan.",

    maxProducts: 100,
    maxEmployees: 4,

    advancedReports: true,
    saleDetails: true,
    inventoryHistory: true,
  },

  pro: {
    name: "Pro",
    price: 2000,
    description:
      "For businesses that need advanced SmartStock capabilities.",

    maxProducts: Infinity,
    maxEmployees: Infinity,

    advancedReports: true,
    saleDetails: true,
    inventoryHistory: true,
  },
};

module.exports = PLAN_LIMITS;