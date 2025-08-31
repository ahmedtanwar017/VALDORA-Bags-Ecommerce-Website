const User = require("../models/user-model");

// ✅ Get secret code from environment
const SECRET_CODE = process.env.ADMIN_SECRET;

// POST /api/admins/verify
const verifyAdmin = async (req, res) => {
  try {
    const { secretCode } = req.body;

    if (!secretCode || !secretCode.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Secret code is required" });
    }

    if (secretCode.trim() !== SECRET_CODE) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid secret code" });
    }

    return res.status(200).json({
      success: true,
      // message: "Admin access granted",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = verifyAdmin;
