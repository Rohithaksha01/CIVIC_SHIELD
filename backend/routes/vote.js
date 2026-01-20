const express = require('express');
const router = express.Router();
const Citizen = require('../models/Citizen');
const Vote = require('../models/Vote');

router.post('/cast', async (req, res) => {
    const { voterId, candidate } = req.body;

    const citizen = await Citizen.findOne({ voterId });
    if (!citizen || citizen.voteCast)
        return res.status(403).json({ message: "Already Voted" });

    citizen.voteCast = true;
    await citizen.save();

    await Vote.create({ voterId, candidate });

    res.json({ message: "Vote Cast Successfully" });
});

module.exports = router;
