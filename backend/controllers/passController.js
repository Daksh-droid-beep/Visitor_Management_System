const Pass = require("../models/PassModel");
const Visitor = require("../models/VisitorModel");
const { generateQRCode } = require("../services/qrCodeService");

// ✅ Generate Pass
exports.generatePass = async (req, res) => {
  try {
    const { visitorId } = req.query;

    const visitor = await Visitor.findById(visitorId);
    if (!visitor) return res.send("Visitor not found ❌");

    // 🔥 NEW: Only approved visitors can get pass
    if (visitor.status !== "approved") {
      return res.send("Visitor not approved yet ❌");
    }

    // 🔥 Prevent duplicate active/check-in pass
    const existingPass = await Pass.findOne({
      visitorId,
      status: { $ne: "checked-out" }
    });

    if (existingPass) {
      return res.send("Visitor already has an active pass ⚠️");
    }

    const passId = "PASS-" + Date.now();

    const qrCode = await generateQRCode(passId);

    const pass = await Pass.create({
      visitorId,
      passId,
      qrCode,
      status: "active"
    });

    res.send({
      message: "Pass generated successfully",
      pass
    });

  } catch (error) {
    res.send(error.message);
  }
};


// ✅ Get all passes
exports.getPasses = async (req, res) => {
  try {
    const passes = await Pass.find().populate("visitorId");
    res.send(passes);
  } catch (error) {
    res.send(error.message);
  }
};