const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
  visitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visitor"
  },
  passId: {
    type: String,
    unique: true
  },
  qrCode: String,
  status: {
    type: String,
    enum: ["active", "checked-in", "checked-out"],
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.model("Pass", passSchema);