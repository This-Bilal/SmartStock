const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const categoryModel = require("../models/categoryModel");
const { checkPlanLimit } = require("../services/subscriptionService");

const createProduct = asyncHandler(async (req, res) => {
  const { name, category, price, costPrice, lowStockLimit } = req.body;

  if (!name || !category || price === undefined || costPrice === undefined) {
    return res.status(400).json({
      message: "Name, category, price and cost price are required.",
    });
  }

  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  const formattedName =
    name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();

  const categoryExists = await Category.findOne({
    _id: category,
    owner: ownerId,
  });

  if (!categoryExists) {
    return res.status(404).json({
      message: "Category not found.",
    });
  }

  const productExists = await Product.findOne({
    owner: ownerId,
    name: {
      $regex: new RegExp(`^${formattedName}$`, "i"),
    },
  });

  if (productExists) {
    return res.status(400).json({
      message: "Product already exists.",
    });
  }

  // Check the owner's product limit
  const currentProducts = await Product.countDocuments({
    owner: ownerId,
  });

  const limitCheck = await checkPlanLimit(
    req.user,
    "maxProducts",
    currentProducts,
  );

  if (!limitCheck.allowed) {
    return res.status(403).json({
      message: `Your ${limitCheck.plan} plan allows a maximum of ${limitCheck.limit} products. Please upgrade your plan.`,
    });
  }

  const cleanName = formattedName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  const prefix = cleanName.substring(0, 3).padEnd(3, "X");

  let generatedSku;
  let skuExists = true;

  while (skuExists) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    generatedSku = `${prefix}-${randomNumber}`;

    skuExists = await Product.exists({
      owner: ownerId,
      sku: generatedSku,
    });
  }

  const image = req.file ? `/uploads/${req.file.filename}` : "";

  const product = await Product.create({
    owner: ownerId,
    name: formattedName,
    sku: generatedSku,
    category,
    price,
    costPrice,
    quantity: 0,
    lowStockLimit: lowStockLimit ?? 5,
    image,
  });

  const createdProduct = await Product.findById(product._id).populate(
    "category",
    "name",
  );

  res.status(201).json(createdProduct);
});

const getProducts = asyncHandler(async (req, res) => {
  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  const products = await Product.find({
    owner: ownerId,
  })
    .populate({
      path: "category",
      select: "name",
    })
    .sort({ createdAt: -1 })
    .select("-owner -__v");

  const activeProducts = products
    .filter((product) => product.category !== null)
    .map((product) => {
      const productData = product.toObject();

      return {
        ...productData,

        name:
          productData.name.charAt(0).toUpperCase() +
          productData.name.slice(1).toLowerCase(),

        category: {
          id: productData.category._id,
          name:
            productData.category.name.charAt(0).toUpperCase() +
            productData.category.name.slice(1).toLowerCase(),
        },
      };
    });

  // Hide cost price from cashier
  if (req.user.role === "cashier") {
    activeProducts.forEach((product) => {
      delete product.costPrice;
    });
  }

  res.status(200).json(activeProducts);
});

const getCashierProducts = asyncHandler(async (req, res) => {
  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  const products = await Product.find({
    owner: ownerId,
    isActive: true,
  })
    .populate({
      path: "category",
      select: "name",
    })
    .sort({ createdAt: -1 })
    .select("-owner -__v");

  const activeProducts = products
    .filter((product) => product.category !== null)
    .map((product) => {
      const productData = product.toObject();

      return {
        ...productData,

        name:
          productData.name.charAt(0).toUpperCase() +
          productData.name.slice(1).toLowerCase(),

        category: {
          id: productData.category._id,
          name:
            productData.category.name.charAt(0).toUpperCase() +
            productData.category.name.slice(1).toLowerCase(),
        },
      };
    });

  // Hide cost price from cashier
  if (req.user.role === "cashier") {
    activeProducts.forEach((product) => {
      delete product.costPrice;
    });
  }

  res.status(200).json(activeProducts);
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  const product = await Product.findOne({
    _id: id,
    owner: ownerId,
    isActive: true,
  })
    .populate({
      path: "category",
      select: "name",
    })
    .select("-owner -__v");

  if (!product || !product.category) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  const productData = product.toObject();

  const formattedProduct = {
    ...productData,

    name:
      productData.name.charAt(0).toUpperCase() +
      productData.name.slice(1).toLowerCase(),

    category: {
      id: productData.category._id,
      name:
        productData.category.name.charAt(0).toUpperCase() +
        productData.category.name.slice(1).toLowerCase(),
    },
  };

  // Hide cost price from cashier
  if (req.user.role === "cashier") {
    delete formattedProduct.costPrice;
  }

  res.status(200).json(formattedProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { name, sku, category, price, costPrice, lowStockLimit } = req.body;

  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  const product = await Product.findOne({
    _id: id,
    owner: ownerId,
    isActive: true,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  let hasChanges = false;

  // Update category
  if (category !== undefined) {
    if (category.toString() !== product.category.toString()) {
      const categoryExists = await Category.findOne({
        _id: category,
        owner: ownerId,
        isActive: true,
      });

      if (!categoryExists) {
        return res.status(404).json({
          message: "Category not found or inactive.",
        });
      }

      product.category = category;
      hasChanges = true;
    }
  }

  // Update SKU
  if (sku !== undefined) {
    if (!sku.trim()) {
      return res.status(400).json({
        message: "SKU cannot be empty.",
      });
    }

    const normalisedSku = sku.trim().toUpperCase();

    if (normalisedSku !== product.sku) {
      const skuExists = await Product.findOne({
        owner: ownerId,
        sku: normalisedSku,
        _id: { $ne: id },
      });

      if (skuExists) {
        return res.status(400).json({
          message: "SKU already exists.",
        });
      }

      product.sku = normalisedSku;
      hasChanges = true;
    }
  }

  // Update name
  if (name !== undefined) {
    if (!name.trim()) {
      return res.status(400).json({
        message: "Product name cannot be empty.",
      });
    }

    const normalisedName = name.trim();

    if (normalisedName.toLowerCase() !== product.name.toLowerCase()) {
      const productExists = await Product.findOne({
        owner: ownerId,
        name: normalisedName,
        _id: { $ne: id },
      });

      if (productExists) {
        return res.status(400).json({
          message: "Product already exists.",
        });
      }

      product.name =
        normalisedName.charAt(0).toUpperCase() +
        normalisedName.slice(1).toLowerCase();

      hasChanges = true;
    }
  }

  // Update price
  if (price !== undefined) {
    if (Number(price) !== Number(product.price)) {
      product.price = price;
      hasChanges = true;
    }
  }

  // Update cost price
  if (costPrice !== undefined) {
    if (Number(costPrice) !== Number(product.costPrice)) {
      product.costPrice = costPrice;
      hasChanges = true;
    }
  }

  // Update low stock limit
  if (lowStockLimit !== undefined) {
    if (Number.isNaN(Number(lowStockLimit))) {
      return res.status(400).json({
        message: "Invalid parameter for low stock limit",
      });
    }

    if (Number(lowStockLimit) !== Number(product.lowStockLimit)) {
      product.lowStockLimit = lowStockLimit;
      hasChanges = true;
    }
  }

  // Update image
  if (req.file) {
    product.image = `/uploads/${req.file.filename}`;
    hasChanges = true;
  }

  // No actual changes were made
  if (!hasChanges) {
    return res.status(400).json({
      message: "No changes were made.",
    });
  }

  await product.save();

  await product.populate("category", "name");

  const productData = product.toObject();

  const formattedProduct = {
    ...productData,
    category: {
      id: productData.category._id,
      name: productData.category.name,
    },
  };

  res.status(200).json(formattedProduct);
});

const toggleProductStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  const product = await Product.findOne({
    _id: id,
    owner: ownerId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  // If the product is currently active, allow deactivation
  if (product.isActive) {
    product.isActive = false;
    product.deactivationReason = "manual";

    await product.save();

    return res.status(200).json(product);
  }

  // Product is currently inactive, so check the active-product limit
  const activeProducts = await Product.countDocuments({
    owner: ownerId,
    isActive: true,
  });

  const limitCheck = await checkPlanLimit(
    req.user,
    "maxProducts",
    activeProducts,
  );

  if (!limitCheck.allowed) {
    return res.status(403).json({
      message: `Your ${limitCheck.plan} plan allows a maximum of ${limitCheck.limit} active products. Please deactivate another product or upgrade your plan.`,
    });
  }

  // Activate the product
  product.isActive = true;
  product.deactivationReason = null;

  await product.save();

  res.status(200).json(product);
});

const getLowStockProducts = asyncHandler(async (req, res) => {
  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  const lowStockProducts = await Product.find({
    owner: ownerId,
    $expr: {
      $and: [
        { $gt: ["$quantity", 0] },
        { $lte: ["$quantity", "$lowStockLimit"] },
      ],
    },
  })
    .populate("category", "name")
    .sort({ quantity: 1 })
    .select("-__v");

  const formattedProduct = lowStockProducts.map((product) => ({
    ...product.toObject(),
    category: {
      id: product.category._id,
      name: product.category.name,
    },
  }));

  res.status(200).json(formattedProduct);
});

const outOfStockProducts = asyncHandler(async (req, res) => {
  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  const outOfStockProducts = await Product.find({
    owner: ownerId,
    quantity: 0,
  })
    .populate("category", "name")
    .sort({ name: 1 })
    .select("-__v");

  const formattedProduct = outOfStockProducts.map((product) => ({
    ...product.toObject(),
    category: {
      id: product.category._id,
      name: product.category.name,
    },
  }));

  res.status(200).json(formattedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getCashierProducts,
  getProduct,
  updateProduct,
  toggleProductStatus,
  getLowStockProducts,
  outOfStockProducts,
};
