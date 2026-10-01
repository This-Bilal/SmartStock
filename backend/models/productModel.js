const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    lowStockLimit: {
      type: Number,
      default: 10,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    deactivationReason: {
      type: String,
      default: null,
      validate: {
        validator: (value) =>
          value === null || value === "manual" || value === "subscription",
        message: "deactivationReason must be manual, subscription, or null.",
      },
    },
  },
  { timestamps: true },
);

productSchema.index({ owner: 1, sku: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
