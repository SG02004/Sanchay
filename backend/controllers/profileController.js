const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/profile — update the logged-in user's name and/or password.
// Changing the password requires the correct currentPassword (verified via bcrypt),
// then the new password is re-hashed before saving.
const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name if provided
    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (trimmed.length === 0) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      user.name = trimmed;
    }

    // Handle a password change only if the user asked for one
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to set a new one" });
      }

      // Verify the current password against the stored hash
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      if (String(newPassword).length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }

      // Re-hash the new password before saving (never store plain text)
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    const updated = await user.save();

    // Never send the password hash back to the client
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      createdAt: updated.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getProfile, updateProfile };
