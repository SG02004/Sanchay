const Transaction = require("../models/Transaction");

// GET /api/transactions — get all transactions for the logged-in user
const getTransactions = async (req, res) => {
  try {
    // req.user._id comes from authMiddleware (JWT decoded)
    // sort by date descending — newest first
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/transactions — create a new transaction
const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;

    const transaction = await Transaction.create({
      userId: req.user._id, // attach to current user
      type,
      category,
      amount,
      description,
      date: date || Date.now(), // use provided date or today
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/transactions/:id — update an existing transaction (the "U" in CRUD)
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Security check: user can only edit THEIR OWN transactions (same rule as delete)
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this transaction" });
    }

    const { type, category, amount, description, date } = req.body;

    // Only overwrite a field if the frontend actually sent it
    if (type !== undefined) transaction.type = type;
    if (category !== undefined) transaction.category = category;
    if (amount !== undefined) transaction.amount = amount;
    if (description !== undefined) transaction.description = description;
    if (date !== undefined) transaction.date = date;

    const updated = await transaction.save(); // save() re-runs the schema validation
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/transactions/:id — delete a specific transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Security check: make sure user can only delete THEIR OWN transactions
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this transaction" });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction };
