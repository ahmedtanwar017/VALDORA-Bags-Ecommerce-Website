const express = require("express");
const router = express.Router();

// Controllers
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/authController.js");

// Middleware
const isloggedIn = require("../middleware/authMiddleware.js");

router.get("/", (req, res) => res.send("✅ Auth API Running"));

// ==========================
// 🔹 Authentication Routes
// ==========================
router.post("/register", registerUser); // Register new user
router.post("/login", loginUser); // Login user
router.get("/logout", logoutUser); // Logout u
router.get("/me", isloggedIn, getMe);

module.exports = router;
