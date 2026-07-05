const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getDashboardData } = require("../controllers/dashboardController");

router.get("/", protect, getDashboardData); // GET /api/dashboard

module.exports = router;
