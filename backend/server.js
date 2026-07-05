const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load .env variables BEFORE anything else uses them
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- MIDDLEWARE ---
// cors() allows React (port 5173) to call Express (port 5000) without browser blocking it
app.use(cors());
// express.json() lets us read JSON request bodies (e.g., { email, password } from login form)
app.use(express.json());

// --- ROUTE IMPORTS ---
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

// Simple test route to verify server is alive
app.get("/", (req, res) => {
  res.json({ message: "Sanchay API is running 🚀" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
