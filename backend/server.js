console.log("🚀 SERVER FILE LOADED");

const express = require("express");
const cors = require("cors");
require("./config/db");
const authRoutes = require("./routes/auth");

const User = require("./models/User");
const Vote = require("./models/Vote");
const Welfare = require("./models/Welfare");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


// ✅ ADD USER
app.post("/add-user", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ CAST VOTE  (THIS IS THE IMPORTANT ONE)
app.post("/cast-vote", async (req, res) => {
  const { voterId, candidate } = req.body;

  if (!voterId || !candidate) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const vote = new Vote({ voterId, candidate });
    await vote.save();

    res.json({ message: "Vote cast successfully" });
  } catch (err) {
    // 🔥 DUPLICATE KEY ERROR HANDLING
    if (err.code === 11000) {
      return res.json({ message: "Voter has already voted" });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ISSUE WELFARE API
app.post("/issue-welfare", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { ration } = req.body;

    if (!ration) {
      return res.status(400).json({
        message: "Ration number is required"
      });
    }

    // Check if already issued
    const exists = await Welfare.findOne({ ration });
    if (exists) {
      return res.status(409).json({
        message: "Welfare already issued for this ration card"
      });
    }

    const doc = await Welfare.create({ ration });
    console.log("SAVED DOC:", doc);

    res.json({
      message: "Welfare issued successfully"
    });

  } catch (err) {
    console.error("ERROR FULL:", err);
    res.status(500).json({
      message: "Server error"
    });
  }
});



// DASHBOARD STATS API
app.get("/dashboard-stats", async (req, res) => {
  try {
    const totalVotes = await Vote.countDocuments();
    const totalWelfare = await Welfare.countDocuments();

    const totalCitizens = totalVotes + totalWelfare;

    res.json({
      votes: totalVotes,
      welfare: totalWelfare,
      citizens: totalCitizens, // ✅ FIXED
      frauds: 12
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ LISTEN MUST BE LAST
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
