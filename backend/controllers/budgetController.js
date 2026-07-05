const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// GET /api/budget — get all budgets with calculated "spent" amount
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });

    // For each budget, calculate how much was actually spent in that category
    // by summing all Expense transactions in that category
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        // MongoDB aggregation: sum all expense amounts for this category
        const result = await Transaction.aggregate([
          {
            $match: {
              userId: req.user._id,
              type: "Expense",
              category: budget.category,
            },
          },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: "$amount" },
            },
          },
        ]);

        const spent = result.length > 0 ? result[0].totalSpent : 0;

        return {
          _id: budget._id,
          category: budget.category,
          limit: budget.limit,
          spent: spent, // Calculated, not stored in DB
          percentage: Math.round((spent / budget.limit) * 100), // For progress bars
        };
      })
    );

    res.json(budgetsWithSpent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/budget — create a new budget category
const createBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;

    // Check if budget already exists for this category
    const existingBudget = await Budget.findOne({ userId: req.user._id, category });
    if (existingBudget) {
      return res.status(400).json({ message: `Budget for "${category}" already exists` });
    }

    const budget = await Budget.create({
      userId: req.user._id,
      category,
      limit,
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getBudgets, createBudget };
