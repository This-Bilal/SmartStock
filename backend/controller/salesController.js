const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Sale = require("../models/saleModel");
const Inventory = require("../models/inventoryModel");
const { DateTime } = require("luxon");
const {
  canUseFeature,
  resolveSubscription,
} = require("../services/subscriptionService");

const createSale = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Cashier only provides the payment method.
    // Backend decides the payment status.
    const { paymentMethod } = req.body;

    const ownerId = req.user.owner;

    const cart = await Cart.findOne({
      employee: req.user._id,
      status: "active",
    }).session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "Cart is empty.",
      });
    }

    let saleItems = [];
    let validatedProducts = [];
    let totalAmount = 0;

    /* Validate cart items again.
       Cart does not reserve stock.
       Stock can change before checkout. */

    for (const item of cart.items) {
      const product = await Product.findOne({
        _id: item.product,
        owner: ownerId,
        isActive: true,
      }).session(session);

      if (!product) {
        await session.abortTransaction();
        session.endSession();

        return res.status(404).json({
          message: `${item.productName} is no longer available.`,
        });
      }

      if (product.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          message: `${product.name} has insufficient stock.`,
        });
      }

      const subtotal = product.price * item.quantity;

      totalAmount += subtotal;

      saleItems.push({
        product: product._id,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice: product.price,
        costPrice: product.costPrice,
        subtotal,
      });

      validatedProducts.push({
        product,
        quantity: item.quantity,
      });
    }

    /* Generate sale number */

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let saleNumber = "";

    for (let i = 0; i < 9; i++) {
      saleNumber += characters[Math.floor(Math.random() * characters.length)];
    }

    /* Create sale */

    const [sale] = await Sale.create(
      [
        {
          owner: ownerId,
          saleNumber,
          employee: req.user._id,
          items: saleItems,
          totalAmount,
          paymentMethod,
          paymentStatus: "paid",
          status: "completed",
        },
      ],
      {
        session,
      },
    );

    /* Reduce stock and create inventory history */

    for (const item of validatedProducts) {
      const previousStock = item.product.quantity;

      item.product.quantity -= item.quantity;

      const currentStock = item.product.quantity;

      await item.product.save({
        session,
      });

      await Inventory.create(
        [
          {
            owner: ownerId,
            product: item.product._id,
            movementType: "stock_out",
            quantity: item.quantity,
            previousStock,
            currentStock,
            reason: "Product sold",
            sale: sale._id,
            employee: req.user._id,
          },
        ],
        {
          session,
        },
      );
    }

    /* Reset cart for future sales
       Do NOT mark completed because
       employee has a unique cart. */

    cart.items = [];
    cart.totalAmount = 0;
    cart.status = "active";

    await cart.save({
      session,
    });

    await session.commitTransaction();

    session.endSession();

    /* Get completed sale with employee information */

    const saleResponse = await Sale.findById(sale._id)
      .populate("employee", "name role")
      .select("-owner -__v");

    // Convert MongoDB document to normal object
    const saleData = saleResponse.toObject();

    // Convert createdAt from UTC to Nigeria timezone
    saleData.createdAt = DateTime.fromJSDate(saleResponse.createdAt)
      .setZone("Africa/Lagos")
      .toFormat("dd LLL yyyy, hh:mm a");

    res.status(201).json(saleData);
  } catch (error) {
    await session.abortTransaction();

    session.endSession();

    throw error;
  }
});

const getSales = asyncHandler(async (req, res) => {
  let sales;
  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  if (req.user.role === "owner") {
    // Owner gets all sales belonging to their business
    sales = await Sale.find({
      owner: ownerId,
    })
      .populate("employee", "name email role")
      .sort({ createdAt: -1 })
      .select("-owner")
      .select("-__v")
      .select("-updatedAt");
  } else if (req.user.role === "manager") {
    // Manager gets all sales belonging to the business
    sales = await Sale.find({
      owner: ownerId,
    })
      .populate("employee", "name email role")
      .sort({ createdAt: -1 })
      .select("-owner")
      .select("-__v")
      .select("-updatedAt");
  } else {
    // Cahier gets only their own sales
    sales = await Sale.find({
      owner: ownerId,
      employee: req.user._id,
    })
      .populate("employee", "name email role")
      .sort({ createdAt: -1 })
      .select("-owner")
      .select("-__v")
      .select("-updatedAt");
  }

  const formattedSales = sales.map((item) => ({
    ...item.toObject(),

    createdAt: DateTime.fromJSDate(item.createdAt)
      .setZone("Africa/Lagos")
      .toFormat("dd LLL yyyy, hh:mm a"),
  }));

  res.status(200).json(formattedSales);
});

const getSaleByNumber = asyncHandler(async (req, res) => {
  const subscription = await resolveSubscription(req.user);

  const allowed = canUseFeature(subscription, "saleDetails");

  if (!allowed) {
    return res.status(403).json({
      message:
        "Sale details are available on the Basic plan and above. Please upgrade your plan to access this feature.",
    });
  }

  const { saleNumber } = req.params;

  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  const sale = await Sale.findOne({
    saleNumber,
    owner: ownerId,
  })
    .populate("employee", "name email role")
    .populate("items.product", "name sku")
    .select("-owner")
    .select("-__v")
    .select("-updatedAt");

  if (!sale) {
    return res.status(404).json({
      message: "Sale not found.",
    });
  }

  // Convert MongoDB document to normal object
  const saleData = sale.toObject();

  // Convert createdAt from UTC to Nigeria timezone
  saleData.createdAt = DateTime.fromJSDate(sale.createdAt)
    .setZone("Africa/Lagos")
    .toFormat("dd LLL yyyy, hh:mm a");

  res.status(200).json(saleData);
});

module.exports = {
  createSale,
  getSales,
  getSaleByNumber,
};
