const express = require("express");
const { getProducts, createProduct } = require("../controllers/productController.js");
const isloggedIn = require("../middleware/authMiddleware.js");

const router = express.Router();

// ✅ pass function references, NOT calls
router.get("/store", isloggedIn, getProducts);
router.post('/create', isloggedIn, createProduct);

module.exports = router;
