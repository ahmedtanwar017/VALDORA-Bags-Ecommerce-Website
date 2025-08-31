const express = require("express");
const verifyAdmin  = require("../controllers/adminController");
const isloggedIn = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/verify", isloggedIn, verifyAdmin);

module.exports = router;
