const Pass = require("../models/PassModel");
const Visitor = require("../models/VisitorModel");
const { generateQRCode } = require("../services/qrCodeService");

// ✅ Generate Pass
exports.generatePass = async (req, res) => {
  try {
    const { visitorId } = req.query;

    const visitor = await Visitor.findById(visitorId);
    if (!visitor) return res.send("Visitor not found");

    const passId = "PASS-" + Date.now();

    const qrCode = await generateQRCode(passId);

    const pass = await Pass.create({
      visitorId,
      passId,
      qrCode
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