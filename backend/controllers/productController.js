const Product = require("../models/product-model.js");

const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    let products;
    if (category && category !== "all") {
      products = await Product.find({ category });
    } else {
      products = await Product.find();
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getProducts };
