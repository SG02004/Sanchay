const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

router.use(protect);

router.get("/", getBudgets);          // GET    /api/budget
router.post("/", createBudget);       // POST   /api/budget
router.put("/:id", updateBudget);     // PUT    /api/budget/:id     (edit limit)
router.delete("/:id", deleteBudget);  // DELETE /api/budget/:id     (remove)

module.exports = router;
