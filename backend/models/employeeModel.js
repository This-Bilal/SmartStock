const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
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

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address.",
      ],
    },

    password: {
      type: String,
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: true,
    },

    emailVerificationTokenHash: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    role: {
      type: String,
      enum: ["manager", "cashier"],
      default: "cashier",
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

employeeSchema.index({ owner: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Employee", employeeSchema);