const User = require("../models/User");
const Transaction = require("../models/Transaction");

// GET /api/admin/users — list all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // Get all users, exclude passwords, newest first
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/admin/users/:id — delete a user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own admin account" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/admin/stats — get system-wide statistics (admin only)
const getSystemStats = async (req, res) => {
  try {
    const [totalUsers, totalTransactions, amountsByType] = await Promise.all([
      User.countDocuments(),
      Transaction.countDocuments(),
      Transaction.aggregate([
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    const totalIncome =
      amountsByType.find((t) => t._id === "Income")?.total || 0;
    const totalExpense =
      amountsByType.find((t) => t._id === "Expense")?.total || 0;
    const totalVolume = totalIncome + totalExpense;

    res.json({
      totalUsers,
      totalTransactions,
      totalIncome,
      totalExpense,
      totalVolume,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllUsers, deleteUser, getSystemStats };
