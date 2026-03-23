const Pass = require("../models/PassModel");
const CheckLog = require("../models/CheckLogModel");

// ✅ CHECK-IN
exports.checkIn = async (req, res) => {
  try {
    const { passId } = req.query;

    const pass = await Pass.findOne({ passId });
    if (!pass) return res.send("Pass not found");

    // 🔥 Prevent duplicate check-in
    if (pass.status === "checked-in") {
      return res.send("Already checked-in ⚠️");
    }

    pass.status = "checked-in";
    await pass.save();

    await CheckLog.create({
      pass: pass._id, // ✅ FIXED
      status: "checked-in",
      scannedBy: req.user.id // ✅ who scanned
    });

    res.send("Visitor checked-in ✅");

  } catch (error) {
    res.send(error.message);
  }
};

// ✅ CHECK-OUT
exports.checkOut = async (req, res) => {
  try {
    const { passId } = req.query;

    const pass = await Pass.findOne({ passId });
    if (!pass) return res.send("Pass not found");

    // 🔥 Prevent invalid checkout
    if (pass.status !== "checked-in") {
      return res.send("Visitor not checked-in yet ❌");
    }

    pass.status = "checked-out";
    await pass.save();

    await CheckLog.create({
      pass: pass._id, // ✅ FIXED
      status: "checked-out",
      scannedBy: req.user.id
    });

    res.send("Visitor checked-out ✅");

  } catch (error) {
    res.send(error.message);
  }
};

// ✅ GET LOGS
exports.getLogs = async (req, res) => {
  try {
    const logs = await CheckLog.find()
      .populate("pass")
      .populate("scannedBy", "name role")
      .sort({ createdAt: -1 });

    res.send(logs);
  } catch (error) {
    res.send(error.message);
  }
};