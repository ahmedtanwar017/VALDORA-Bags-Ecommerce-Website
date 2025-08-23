const express = require("express");
const router = express.Router();

// Controllers
const { registerUser, loginUser, logoutUser } = require("../controllers/authController.js");
const { settings } = require("../controllers/settingController.js");

// Middleware
const isLoggedIn = require("../middleware/authMiddleware.js");


// ==========================
// 🔹 Test Route
// ==========================
router.get("/", (req, res) => res.send("✅ Auth API Running"));


// ==========================
// 🔹 Authentication Routes
// ==========================
router.post("/register", registerUser);   // Register new user
router.post("/login", loginUser);         // Login user
router.get("/logout", logoutUser);        // Logout user


// ==========================
// 🔹 User Profile
// ==========================
// Returns logged-in user info
router.get("/me", isLoggedIn, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,  // user is attached by middleware
  });
});


// ==========================
// 🔹 User Settings
// ==========================
// Update or manage settings (protected)
router.put("/settings", isLoggedIn, settings);  


module.exports = router;
