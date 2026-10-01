const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
      unique: true,
    },

    plan: {
      type: String,
      enum: ["free", "basic", "pro"],
      default: "free",
    },

    status: {
      type: String,
      enum: ["active", "trialing", "expired", "cancelled"],
      default: "active",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
