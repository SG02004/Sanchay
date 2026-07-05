const User = require("../models/User");

// GET /api/profile — get current user's profile info
const getProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware, but doesn't include all fields
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getProfile };
