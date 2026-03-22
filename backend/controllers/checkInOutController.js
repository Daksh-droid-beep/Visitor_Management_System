const Pass = require("../models/PassModel");
const CheckLog = require("../models/CheckLogModel");

// ✅ CHECK-IN
exports.checkIn = async (req, res) => {
  try {
    const { passId } = req.query;

    const pass = await Pass.findOne({ passId });
    if (!pass) return res.send("Pass not found");

    pass.status = "checked-in";
    await pass.save();

    await CheckLog.create({
      passId,
      status: "checked-in"
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

    pass.status = "checked-out";
    await pass.save();

    await CheckLog.create({
      passId,
      status: "checked-out"
    });

    res.send("Visitor checked-out ✅");

  } catch (error) {
    res.send(error.message);
  }
};

// ✅ GET LOGS
exports.getLogs = async (req, res) => {
  try {
    const logs = await CheckLog.find().sort({ time: -1 });
    res.send(logs);
  } catch (error) {
    res.send(error.message);
  }
};