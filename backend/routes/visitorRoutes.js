const express = require("express");
const router = express.Router();

const {
  addVisitor,
  getVisitors
} = require("../controllers/visitorController");

// ✅ Add visitor
router.get("/add", addVisitor);

// Example:
// http://localhost:5000/api/visitors/add?name=Rahul&email=rahul@gmail.com&phone=9999999999&purpose=Meeting&host=Manager

// ✅ Get all visitors
router.get("/", getVisitors);

module.exports = router;