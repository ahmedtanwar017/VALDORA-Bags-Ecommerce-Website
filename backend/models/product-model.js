// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // product name is a must
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: true, // price is required
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    finalPrice: {
      type: Number,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-calculate final price before saving
productSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * this.discount) / 100;
  next();
});

module.exports = mongoose.model("Product", productSchema);
