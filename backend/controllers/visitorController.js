const Visitor = require("../models/VisitorModel");

// ✅ Add Visitor (browser testable)
exports.addVisitor = async (req, res) => {
  try {
    const { name, email, phone, purpose, host } = req.query;

    if (!name) {
      return res.send("Name is required");
    }

    const visitor = await Visitor.create({
      name,
      email,
      phone,
      purpose,
      host
    });

    res.send({
      message: "Visitor added successfully",
      visitor
    });

  } catch (error) {
    res.send(error.message);
  }
};

// ✅ Get All Visitors
exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });

    // 👇 Clean response (IMPORTANT)
    const formatted = visitors.map(v => ({
      _id: v._id,
      name: v.name,
      email: v.email,
      phone: v.phone,
      purpose: v.purpose,
      status: v.status
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};