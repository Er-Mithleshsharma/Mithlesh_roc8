const express = require("express");
const { registerUser, loginUser } = require("../controllers/UserControllers"); // Adjust the path as necessary

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Get user data (protected route)
router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "mithlesh");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
});

module.exports = router;
