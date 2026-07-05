const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/profileController");

router.get("/", protect, getProfile); // GET /api/profile

module.exports = router;
