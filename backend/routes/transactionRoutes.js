const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

// All routes below are protected — user must be logged in (JWT required)
router.use(protect);

router.get("/", getTransactions);           // GET    /api/transactions
router.post("/", createTransaction);        // POST   /api/transactions
router.put("/:id", updateTransaction);      // PUT    /api/transactions/:id  (edit)
router.delete("/:id", deleteTransaction);   // DELETE /api/transactions/:id

module.exports = router;
