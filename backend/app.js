const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root test
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Routes IMPORT (IMPORTANT STEP)
const authRoutes = require("./routes/authenticationRoutes");

// Routes USE
app.use("/api/auth", authRoutes);

module.exports = app;

const visitorRoutes = require("./routes/visitorRoutes");

app.use("/api/visitors", visitorRoutes);

const passRoutes = require("./routes/passRoutes");

app.use("/api/passes", passRoutes);

const checkRoutes = require("./routes/checkInOutRoutes");

app.use("/api/check", checkRoutes);