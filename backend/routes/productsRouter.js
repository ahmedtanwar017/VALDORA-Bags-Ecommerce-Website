const express = require("express");
const { getProducts } = require("../controllers/productController.js");
const isloggedIn = require("../middleware/authMiddleware.js");

const router = express.Router();

// ✅ pass function references, NOT calls
router.get("/store", isloggedIn, getProducts);

module.exports = router;
