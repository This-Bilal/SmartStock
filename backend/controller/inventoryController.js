const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Inventory = require("../models/inventoryModel");
const { DateTime } = require("luxon");
const {
  canUseFeature,
  resolveSubscription,
} = require("../services/subscriptionService");

const addStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity, reason } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({
      message: "Please provide a valid quantity.",
    });
  }

  const ownerId = req.user.owner;

  const product = await Product.findOne({
    _id: productId,
    owner: ownerId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  const previousStock = product.quantity;

  product.quantity += Number(quantity);

  await product.save();

  const inventory = await Inventory.create({
    owner: ownerId,
    product: product._id,
    movementType: "stock_in",
    quantity: Number(quantity),
    previousStock,
    currentStock: product.quantity,
    reason: reason || "Stock added",
    employee: req.user._id,
  });

  const inventoryResponse = await Inventory.findById(inventory._id)
    .populate("product", "name")
    .populate("employee", "name role")
    .select("-owner -__v");

  res.status(200).json(inventoryResponse);
});

const removeStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity, reason } = req.body;

  const numericQuantity = Number(quantity);

  if (
    quantity === undefined ||
    quantity === null ||
    quantity === "" ||
    !Number.isFinite(numericQuantity) ||
    numericQuantity <= 0
  ) {
    return res.status(400).json({
      message: "Please provide a valid quantity.",
    });
  }

  const ownerId = req.user.owner;

  const product = await Product.findOne({
    _id: productId,
    owner: ownerId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  const previousStock = product.quantity;

  if (numericQuantity > previousStock) {
    return res.status(400).json({
      message: "Insufficient stock available.",
    });
  }

  product.quantity -= numericQuantity;

  await product.save();

  const inventory = await Inventory.create({
    owner: ownerId,
    product: product._id,
    movementType: "stock_out",
    quantity: numericQuantity,
    previousStock,
    currentStock: product.quantity,
    reason: reason || "Stock removed",
    employee: req.user._id,
  });

  const inventoryResponse = await Inventory.findById(inventory._id)
    .populate("product", "name")
    .populate("employee", "name role")
    .select("-owner -__v");

  res.status(200).json(inventoryResponse);
});

const updateStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const { movementType, quantity, reason } = req.body;

  if (!["stock_in", "stock_out"].includes(movementType)) {
    return res.status(400).json({
      message: "Invalid movement type.",
    });
  }

  if (!reason) {
    return res.status(400).json({
      message: "Reason for adjustment must be stated",
    });
  }

  if (!quantity || quantity <= 0) {
    return res.status(400).json({
      message: "Quantity must be greater than zero.",
    });
  }

  const product = await Product.findOne({
    _id: productId,
    owner: req.user.owner,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  const previousStock = product.quantity;
  let currentStock;

  if (movementType === "stock_in") {
    currentStock = previousStock + quantity;
  } else {
    if (quantity > previousStock) {
      return res.status(400).json({
        message: "Insufficient stock available.",
      });
    }

    currentStock = previousStock - quantity;
  }

  product.quantity = currentStock;
  await product.save();

  const inventory = await Inventory.create({
    owner: req.user.owner,
    product: product._id,
    movementType,
    quantity,
    previousStock,
    currentStock,
    reason,
    employee: req.user._id,
  });

  const inventoryResponse = await Inventory.findById(inventory._id)
    .populate("product", "name")
    .populate("employee", "name role")
    .select("-owner -__v");

  res.status(200).json(inventoryResponse);
});

const getInventoryHistory = asyncHandler(async (req, res) => {
  const subscription = await resolveSubscription(req.user);

  const allowed = canUseFeature(subscription, "inventoryHistory");

  if (!allowed) {
    return res.status(403).json({
      message:
        "Inventory history is available on the Basic plan and above. Please upgrade your plan to access this feature.",
    });
  }

  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  const inventoryHistory = await Inventory.find({
    owner: ownerId,
  })
    .populate("product", "name sku")
    .populate("employee", "name role")
    .populate("sale", "saleNumber")
    .sort({ createdAt: -1 })
    .select("-__v")
    .select("-updatedAt");

  const formattedHistory = inventoryHistory.map((item) => ({
    ...item.toObject(),

    createdAt: DateTime.fromJSDate(item.createdAt)
      .setZone("Africa/Lagos")
      .toFormat("dd LLL yyyy, hh:mm a"),
  }));

  res.status(200).json(formattedHistory);
});

module.exports = {
  addStock,
  removeStock,
  updateStock,
  getInventoryHistory,
};
