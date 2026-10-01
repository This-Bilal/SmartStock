const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    movementType: {
      type: String,
      enum: ["stock_in", "stock_out"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true
    },

    previousStock: {
      type: Number,
      required: true,
    },

    currentStock: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      default: "",
      trim: true,
    },

    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Inventory", inventorySchema);
