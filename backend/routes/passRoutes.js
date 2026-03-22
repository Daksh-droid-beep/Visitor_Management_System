const express = require("express");
const router = express.Router();

const {
  generatePass,
  getPasses
} = require("../controllers/passController");

// ✅ Generate pass
router.get("/generate", generatePass);

// Example:
// http://localhost:5000/api/passes/generate?visitorId=XXXX

// ✅ Get all passes
router.get("/", getPasses);

module.exports = router;