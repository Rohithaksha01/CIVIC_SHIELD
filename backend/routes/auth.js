const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // 2️⃣ Find admin
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // 🔍 DEBUG (TEMPORARY)
    console.log("ADMIN DOCUMENT:", admin);
    console.log("ADMIN PASSWORD FIELD:", admin.password);

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    // 4️⃣ Success
    res.json({
      success: true,
      role: "admin"
    });

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;