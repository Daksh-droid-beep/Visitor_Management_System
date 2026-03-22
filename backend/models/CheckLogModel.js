const mongoose = require("mongoose");

const checkLogSchema = new mongoose.Schema({
  passId: String,
  status: {
    type: String,
    enum: ["checked-in", "checked-out"]
  },
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CheckLog", checkLogSchema);