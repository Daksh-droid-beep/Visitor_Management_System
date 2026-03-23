const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visitor"
  },

  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  date: Date,
  time: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);