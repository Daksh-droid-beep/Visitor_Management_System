const express = require("express");
const router = express.Router();

const {
  checkIn,
  checkOut,
  getLogs
} = require("../controllers/checkInOutController");

// ✅ Check-in
router.get("/checkin", checkIn);

// Example:
// http://localhost:5000/api/check/checkin?passId=PASS-XXXX

// ✅ Check-out
router.get("/checkout", checkOut);

// Example:
// http://localhost:5000/api/check/checkout?passId=PASS-XXXX

// ✅ Logs
router.get("/logs", getLogs);

module.exports = router;