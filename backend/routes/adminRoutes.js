const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { getAllUsers, deleteUser } = require("../controllers/adminController");

// Both middlewares applied: first check JWT (protect), then check admin role (adminOnly)
router.use(protect, adminOnly);

router.get("/users", getAllUsers);         // GET /api/admin/users
router.delete("/users/:id", deleteUser);   // DELETE /api/admin/users/:id

module.exports = router;
