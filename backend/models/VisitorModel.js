const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  purpose: String,
  host: String,
  photo: String
}, { timestamps: true });

module.exports = mongoose.model("Visitor", visitorSchema);