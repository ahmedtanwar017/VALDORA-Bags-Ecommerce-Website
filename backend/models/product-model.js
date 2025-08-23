const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String }, // URL to product image
  category: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
