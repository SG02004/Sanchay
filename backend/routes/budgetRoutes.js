const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getBudgets, createBudget } = require("../controllers/budgetController");

router.use(protect);

router.get("/", getBudgets);      // GET /api/budget
router.post("/", createBudget);   // POST /api/budget

module.exports = router;
