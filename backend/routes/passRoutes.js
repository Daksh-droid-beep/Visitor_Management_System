const express = require("express");
const router = express.Router();

const { generatePass, getPasses } = require("../controllers/passController");
const verifyToken = require("../middleware/verifyTokenMiddleware");
const authorize = require("../middleware/roleAuthorizationMiddleware");

// ✅ Generate Pass → ONLY ADMIN
router.get("/generate", verifyToken, authorize("admin"), generatePass);

// ✅ Get all passes → ALL LOGGED-IN USERS
router.get("/", verifyToken, getPasses);

module.exports = router;