const mongoose = require("mongoose");

// Transaction schema — every income or expense entry
const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Links to the User who owns this transaction
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["Income", "Expense"], // Only two types allowed
    required: [true, "Transaction type is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    // Fixed categories for clean data — matches pie chart labels
    enum: [
      "Food", "Shopping", "Travel", "Bills",
      "Entertainment", "Health", "Education", "Other",  // Expense categories
      "Salary", "Freelance", "Investment",              // Income categories
    ],
  },
  amount: {
    type: Number, // Stored as raw number (500, not "₹500")
    required: [true, "Amount is required"],
    min: [0, "Amount cannot be negative"],
  },
  description: {
    type: String,
    trim: true,
    default: "", // Optional — like "Swiggy order" or "July salary"
  },
  date: {
    type: Date, // Proper Date object — enables sorting and filtering
    required: [true, "Date is required"],
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Transaction", transactionSchema);
