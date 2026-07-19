const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/profileController");

router.get("/", protect, getProfile); // GET /api/profile
router.put("/", protect, updateProfile); // PUT /api/profile — edit name / change password

module.exports = router;
