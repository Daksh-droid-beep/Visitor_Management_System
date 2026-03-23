const mongoose = require("mongoose");

const checkLogSchema = new mongoose.Schema({
  pass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pass"
  },

  status: {
    type: String,
    enum: ["checked-in", "checked-out"]
  },

  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"   // security guard
  }

}, { timestamps: true });

module.exports = mongoose.model("CheckLog", checkLogSchema);