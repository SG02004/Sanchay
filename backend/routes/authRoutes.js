const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// POST /api/auth/register — create new account
router.post("/register", register);

// POST /api/auth/login — login and get token
router.post("/login", login);

module.exports = router;
