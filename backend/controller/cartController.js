const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({
    employee: req.user._id,
    status: "active",
  })
    .select("-employee")
    .select("-owner")
    .select("-__v");

  if (!cart) {
    return res.status(200).json({
      cart: {
        items: [],
        totalAmount: 0,
      },
    });
  }

  res.status(200).json({
    cart,
  });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  const qty = Number(quantity);

  if (!productId) {
    return res.status(400).json({
      message: "Product Id is needed",
    });
  }

  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({
      message: "Quantity must be greater than zero.",
    });
  }

  const product = await Product.findOne({
    _id: productId,
    owner: ownerId,
    isActive: true,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  // Check available stock before adding
  if (product.quantity < qty) {
    return res.status(400).json({
      message: "Insufficient stock.",
    });
  }

  let cart = await Cart.findOne({
    employee: req.user._id,
    status: "active",
  })
    .select("-employee")
    .select("-owner")
    .select("-__v");

  if (!cart) {
    cart = await Cart.create({
      owner: ownerId,
      employee: req.user._id,
      items: [],
      totalAmount: 0,
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    const updatedQuantity = existingItem.quantity + qty;

    if (updatedQuantity > product.quantity) {
      return res.status(400).json({
        message: "Insufficient stock.",
      });
    }

    existingItem.quantity = updatedQuantity;

    existingItem.subtotal = updatedQuantity * existingItem.unitPrice;
  } else {
    cart.items.push({
      product: product._id,
      productName: product.name,
      sku: product.sku,
      image: product.image,
      quantity: qty,
      unitPrice: product.price,
      subtotal: product.price * qty,
    });
  }

  cart.totalAmount = cart.items.reduce(
    (total, item) => total + item.subtotal,
    0,
  );

  await cart.save();

  res.status(200).json(cart);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({
      message: "Quantity must be greater than zero.",
    });
  }

  const cart = await Cart.findOne({
    employee: req.user._id,
    status: "active",
  })
    .select("-employee")
    .select("-owner")
    .select("-__v");

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found.",
    });
  }

  const item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    return res.status(404).json({
      message: "Product not found in cart.",
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

  if (product.quantity < quantity) {
    return res.status(400).json({
      message: "Insufficient stock.",
    });
  }

  item.quantity = quantity;

  item.subtotal = item.quantity * item.unitPrice;

  cart.totalAmount = cart.items.reduce(
    (total, item) => total + item.subtotal,
    0,
  );

  await cart.save();

  res.status(200).json(cart);
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({
    employee: req.user._id,
    status: "active",
  })
    .select("-employee")
    .select("-owner")
    .select("-__v");

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found.",
    });
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  cart.totalAmount = cart.items.reduce(
    (total, item) => total + item.subtotal,
    0,
  );

  await cart.save();

  res.status(200).json(cart);
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({
    employee: req.user._id,
  })
    .select("-employee")
    .select("-owner")
    .select("-__v");

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found.",
    });
  }

  cart.items = [];

  cart.totalAmount = 0;

  cart.status = "active";

  await cart.save();

  res.status(200).json(cart);
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
