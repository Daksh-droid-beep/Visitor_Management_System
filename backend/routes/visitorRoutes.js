const express = require("express");
const router = express.Router();

const { addVisitor, getVisitors } = require("../controllers/visitorController");
const verifyToken = require("../middleware/verifyTokenMiddleware");
const authorize = require("../middleware/roleAuthorizationMiddleware");

// ✅ Get all visitors → ALL LOGGED-IN USERS
router.get("/", verifyToken, getVisitors);

// ✅ Add visitor → ONLY ADMIN (recommended)
router.get("/add", verifyToken, authorize("admin"), addVisitor);

module.exports = router;