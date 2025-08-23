const User = require("../models/user-model");

const settings = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id; // Get from authenticated user

    // Validate input
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: "Valid admin code is required" 
      });
    }

    // Verify admin code
    if (code !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ 
        success: false,
        message: "Invalid admin code" 
      });
    }

    // Update user to admin
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isAdmin: true },
      { new: true, select: '_id name isAdmin' } // Only return necessary fields
    );

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Successful response
    return res.status(200).json({ 
      success: true,
      message: "Admin privileges granted successfully",
      data: {
        user: updatedUser
      }
    });

  } catch (err) {
    console.error("Admin promotion error:", err);
    
    const errorResponse = {
      success: false,
      message: "Server error during admin promotion"
    };

    if (process.env.NODE_ENV === "development") {
      errorResponse.error = err.message;
      errorResponse.stack = err.stack;
    }

    return res.status(500).json(errorResponse);
  }
};

module.exports = { settings };