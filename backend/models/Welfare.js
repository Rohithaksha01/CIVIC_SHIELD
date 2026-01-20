const mongoose = require("mongoose");

const welfareSchema = new mongoose.Schema({
  ration: {
    type: String,
    required: true,
    unique: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Welfare", welfareSchema);
