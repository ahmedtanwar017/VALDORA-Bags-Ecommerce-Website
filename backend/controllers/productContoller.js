const Product = require("../models/product-model");

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) return res.json({ message: "No products available" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProducts, getProductById };
