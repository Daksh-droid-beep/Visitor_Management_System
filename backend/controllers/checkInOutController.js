const Pass = require("../models/PassModel");
const CheckLog = require("../models/CheckLogModel");

// ✅ CHECK-IN
exports.checkIn = async (req, res) => {
  try {
    const { passId } = req.query;

    const pass = await Pass.findOne({ passId });
    if (!pass) return res.send("Pass not found ❌");

    // 🔥 STRICT RULE: Only ACTIVE pass can check-in
    if (pass.status !== "active") {
      return res.send("Pass is not valid for check-in ❌");
    }

    pass.status = "checked-in";
    await pass.save();

    await CheckLog.create({
      pass: pass._id,
      status: "checked-in",
      scannedBy: req.user.id
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
    if (!pass) return res.send("Pass not found ❌");

    // 🔥 Only checked-in can check-out
    if (pass.status !== "checked-in") {
      return res.send("Visitor not checked-in yet ❌");
    }

    // 🔥 Mark as COMPLETED (dead pass)
    pass.status = "checked-out";
    await pass.save();

    await CheckLog.create({
      pass: pass._id,
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