const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ REGISTER (browser testable)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.query;

    if (!name || !email || !password) {
      return res.send("Please provide name, email, password");
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.send({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.send(error.message);
  }
};

// ✅ LOGIN (browser testable)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.query;

    const user = await User.findOne({ email });
    if (!user) return res.send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Invalid password");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.send({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.send(error.message);
  }
};