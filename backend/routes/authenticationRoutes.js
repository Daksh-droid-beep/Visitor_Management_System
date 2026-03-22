const express = require("express");
const router = express.Router();

// Import controller functions
const {
  register,
  login
} = require("../controllers/authenticationController");

// ✅ Test route (for checking API in browser)
router.get("/", (req, res) => {
  res.send("Auth API working ✅");
});

// ✅ REGISTER (browser testable)
router.get("/register", register);

// Example:
// http://localhost:5000/api/auth/register?name=Daksh&email=daksh@gmail.com&password=123456


// ✅ LOGIN (browser testable)
router.get("/login", login);

// Example:
// http://localhost:5000/api/auth/login?email=daksh@gmail.com&password=123456


module.exports = router;