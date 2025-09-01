const Product = require("../models/product-model.js");

const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const query = (category && category !== "all") ? { category } : {};
    const products = await Product.find(query);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      discount, 
      image, 
      backgroundColor, 
      category, 
      stock,
      tags 
    } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product name, price, and category are required'
      });
    }

    // Calculate final price
    const finalPrice = discount 
      ? price - (price * (discount / 100)) 
      : price;

    // Create new product
    const product = new Product({
      name,
      description: description || '',
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : 0,
      finalPrice: parseFloat(finalPrice.toFixed(2)),
      image: image || '',
      backgroundColor: backgroundColor || '#FFFFFF',
      category,
      stock: stock ? parseInt(stock) : 0,
      tags: tags || []
    });

    // Save to database
    const savedProduct = await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
      error: error.message
    });
  }
};

module.exports = { getProducts,createProduct };
