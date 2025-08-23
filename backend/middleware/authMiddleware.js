const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const isLoggedIn = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: No valid token provided" 
      });
    }

    const token = authHeader.split(" ")[1].trim();
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: Malformed token" 
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: Invalid token payload" 
      });
    }

    // 3. Fetch user from DB
    const user = await User.findById(decoded.id).select('-password'); // Exclude sensitive data
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // 4. Attach user to request
    req.user = user;
    next();

  } catch (err) {
    console.error("Authentication Error:", err.message);
    
    let message = "Invalid or expired token";
    if (err.name === 'TokenExpiredError') {
      message = "Token expired";
    } else if (err.name === 'JsonWebTokenError') {
      message = "Invalid token";
    }

    res.status(401).json({ 
      success: false,
      message: message,
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  }
};

module.exports = isLoggedIn;