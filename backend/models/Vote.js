const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  voterId: {
    type: String,
    required: true,
    unique: true   // 🔒 DATABASE-LEVEL PROTECTION
  },
  candidate: {
    type: String,
    required: true
  },
  votedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Vote", VoteSchema);
