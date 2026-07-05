const Transaction = require("../models/Transaction");

// GET /api/dashboard — all the numbers for the dashboard page in ONE API call
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // --- 1. Calculate totals using MongoDB aggregation ---
    // Groups all transactions by type (Income/Expense) and sums the amounts
    const totals = await Transaction.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$type", // Group by "Income" or "Expense"
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Extract income and expense from aggregation result
    let totalIncome = 0;
    let totalExpense = 0;
    totals.forEach((item) => {
      if (item._id === "Income") totalIncome = item.total;
      if (item._id === "Expense") totalExpense = item.total;
    });

    const balance = totalIncome - totalExpense;

    // --- 2. Category-wise expense breakdown (for pie chart) ---
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { userId: userId, type: "Expense" } },
      {
        $group: {
          _id: "$category",
          value: { $sum: "$amount" },
        },
      },
      { $sort: { value: -1 } }, // Highest spending category first
    ]);

    // Format for Recharts: [{ name: "Food", value: 4500 }, ...]
    const pieChartData = categoryBreakdown.map((item) => ({
      name: item._id,
      value: item.value,
    }));

    // --- 3. Recent transactions (last 5) ---
    const recentTransactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    // --- 4. Monthly data for bar chart (last 6 months) ---
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Transaction.aggregate([
      { $match: { userId: userId, date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Format monthly data for bar chart
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyChartData = {};

    monthlyData.forEach((item) => {
      const key = `${monthNames[item._id.month - 1]} ${item._id.year}`;
      if (!monthlyChartData[key]) {
        monthlyChartData[key] = { month: key, income: 0, expense: 0 };
      }
      if (item._id.type === "Income") monthlyChartData[key].income = item.total;
      if (item._id.type === "Expense") monthlyChartData[key].expense = item.total;
    });

    res.json({
      totalIncome,
      totalExpense,
      balance,
      pieChartData,
      recentTransactions,
      monthlyChartData: Object.values(monthlyChartData),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getDashboardData };
