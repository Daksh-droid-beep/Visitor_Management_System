const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.query;

    // 🔍 Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, password"
      });
    }

    // 🔍 Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "employee" // default role
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.query;

    // 🔍 Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password"
      });
    }

    // 🔍 Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 🔐 Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    // 🔐 Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ SEND RESPONSE (UPDATED)
    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role   // 🔥 VERY IMPORTANT
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};