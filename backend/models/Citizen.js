const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
    name: String,
    aadhaar: { type: String, unique: true },
    voterId: String,
    faceHash: String,
    fingerprintHash: String,
    welfareUsed: { type: Boolean, default: false },
    voteCast: { type: Boolean, default: false }
});

module.exports = mongoose.model("Citizen", citizenSchema);
