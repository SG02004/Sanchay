const mongoose = require("mongoose");

// Budget schema — how much a user wants to spend per category
// "spent" is NOT stored — it's calculated from transactions on the fly
const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      "Food", "Shopping", "Travel", "Bills",
      "Entertainment", "Health", "Education", "Other",
    ],
  },
  limit: {
    type: Number, // Budget cap — e.g., 10000 means ₹10,000 max
    required: [true, "Budget limit is required"],
    min: [0, "Limit cannot be negative"],
  },
}, {
  timestamps: true,
});

// A user can only have ONE budget per category (no duplicate "Food" budgets)
budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
