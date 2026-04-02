const express = require("express");
const router = express.Router();

const { addVisitor, getVisitors, updateVisitorStatus } = require("../controllers/visitorController");

const verifyToken = require("../middleware/verifyTokenMiddleware");
const authorize = require("../middleware/roleAuthorizationMiddleware");

// ✅ Get all visitors → ALL LOGGED-IN USERS
router.get("/", verifyToken, getVisitors);

// ✅ Add visitor → ONLY ADMIN
router.get("/add", verifyToken, authorize("admin"), addVisitor);

// ✅ Update visitor status → ONLY ADMIN
router.put("/update-status", verifyToken, authorize("admin"), updateVisitorStatus);

module.exports = router;