const express = require("express");
const router = express.Router();

const {
  checkIn,
  checkOut,
  getLogs
} = require("../controllers/checkInOutController");

const verifyToken = require("../middleware/verifyTokenMiddleware");
const authorize = require("../middleware/roleAuthorizationMiddleware");

// ✅ Check-in → ONLY SECURITY
router.get("/checkin", verifyToken, authorize("security"), checkIn);

// ✅ Check-out → ONLY SECURITY
router.get("/checkout", verifyToken, authorize("security"), checkOut);

// ✅ Logs → ONLY SECURITY
router.get("/logs", verifyToken, authorize("security"), getLogs);

module.exports = router;