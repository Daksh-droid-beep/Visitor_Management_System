const Visitor = require("../models/VisitorModel");
const Pass = require("../models/PassModel"); // 🔥 NEW

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

// ✅ Get All Visitors (UPDATED WITH PASS DATA)
exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });

    const formatted = await Promise.all(
      visitors.map(async (v) => {
        // 🔥 Find pass for each visitor
        const pass = await Pass.findOne({ visitorId: v._id });

        return {
          _id: v._id,
          name: v.name,
          email: v.email,
          phone: v.phone,
          purpose: v.purpose,
          status: v.status,

          // 🔥 NEW FIELDS (VERY IMPORTANT)
          passId: pass ? pass.passId : null,
          passStatus: pass ? pass.status : null
        };
      })
    );

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};