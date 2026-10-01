const Owner = require("../models/ownerModel");
const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({
      message: "Category name is required.",
    });
  }

  const categoryName = name.trim().toLowerCase();

  const categoryExists = await Category.findOne({
    owner: req.user.owner,
    name: categoryName,
  });

  if (categoryExists) {
    return res.status(400).json({
      message: "Category already exists.",
    });
  }

  const category = await Category.create({
    owner: req.user.owner,
    name: categoryName,
  });

  res.status(201).json(category);
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({
    owner: req.user.owner,
  }).sort({ createdAt: -1 });

  res.status(200).json(categories);
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findOne({
    _id: id,
    owner: req.user.owner,
    isActive: true,
  });

  if (!category) {
    return res.status(404).json({
      message: "Category not found.",
    });
  }

  res.status(200).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findOne({
    _id: id,
    owner: req.user.owner,
    isActive: true,
  });

  if (!category) {
    return res.status(404).json({
      message: "Category not found.",
    });
  }

  if (name === undefined) {
    return res.status(400).json({
      message: "No changes were made.",
    });
  }

  if (!name.trim()) {
    return res.status(400).json({
      message: "Category name cannot be empty.",
    });
  }

  const normalisedName = name.trim().toLowerCase();

  // Check if the new name is actually different
  if (normalisedName === category.name.toLowerCase()) {
    return res.status(400).json({
      message: "No changes were made.",
    });
  }

  // Check for duplicate category name
  const duplicate = await Category.findOne({
    owner: req.user.owner,
    name: normalisedName,
    _id: { $ne: id },
  });

  if (duplicate) {
    return res.status(400).json({
      message: "Category name already exists.",
    });
  }

  category.name = normalisedName;

  await category.save();

  res.status(200).json(category);
});

const toggleCategoryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findOne({
    _id: id,
    owner: req.user.owner,
  });

  if (!category) {
    return res.status(404).json({
      message: "Category not found.",
    });
  }

  category.isActive = !category.isActive;

  await category.save();

  res.status(200).json(category);
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  toggleCategoryStatus,
};
