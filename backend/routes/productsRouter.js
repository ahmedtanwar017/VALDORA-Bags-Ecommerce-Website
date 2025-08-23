const express = require("express");
const router = express.Router();
const { getProducts, getProductById } = require("../controllers/productContoller")
const isloggedIn = require("../middleware/authMiddleware");

// All products (only for logged-in users)
router.get("/", isloggedIn, getProducts);

// Single product by ID (only for logged-in users)
router.get("/:id", isloggedIn, getProductById);

module.exports = router;
