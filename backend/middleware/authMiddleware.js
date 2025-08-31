const jwt = require("jsonwebtoken");

const loggedIn = (req, res, next) => {
  try {
    // 1. Check token in cookies
    const token = req.cookies && req.cookies.token;
    if (!token) {
      return res.status(401).redirect("/login");
    }

    // 2. Verify token with secret from environment variable (fallback for dev)
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    );

    // 3. Attach decoded user info to request
    req.user = decoded;

    // 4. Continue to next middleware
    next();
  } catch (err) {
    console.error("Auth error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).send("Session expired. Please log in again.");
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token. Please log in again.");
    } else {
      return res.status(500).send("Internal server error.");
    }
  }
};

module.exports = loggedIn;
