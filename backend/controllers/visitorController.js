const Visitor = require("../models/VisitorModel");
const Pass = require("../models/PassModel");

// ✅ Add Visitor
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


// ✅ Get All Visitors (HIDE checked-out passes)
exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });

    const formatted = await Promise.all(
      visitors.map(async (v) => {

        const pass = await Pass.findOne({
          visitorId: v._id,
          status: { $ne: "checked-out" }
        });

        return {
          _id: v._id,
          name: v.name,
          email: v.email,
          phone: v.phone,
          purpose: v.purpose,
          status: v.status,
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


// ✅ Update Visitor Status (ADMIN ONLY)
exports.updateVisitorStatus = async (req, res) => {
  try {
    const { visitorId, status } = req.query;

    // 🔥 Validate status
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.send("Invalid status ❌");
    }

    const visitor = await Visitor.findById(visitorId);
    if (!visitor) return res.send("Visitor not found ❌");

    visitor.status = status;
    await visitor.save();

    res.send(`Visitor status updated to ${status} ✅`);

  } catch (error) {
    res.send(error.message);
  }
};