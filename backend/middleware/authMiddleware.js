const jwt = require("jsonwebtoken");
const User = require("../models/User");

// This middleware runs BEFORE any protected route handler
// It checks: "Did the user send a valid JWT token?"
// If yes → attaches user info to req.user and lets the request continue
// If no → sends 401 Unauthorized
const protect = async (req, res, next) => {
  let token;

  // Token comes in the Authorization header as: "Bearer eyJhbGciOi..."
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token (remove "Bearer " prefix)
      token = req.headers.authorization.split(" ")[1];

      // Verify token — if someone tampered with it, this throws an error
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from token, exclude password from result
      req.user = await User.findById(decoded.id).select("-password");

      return next(); // Token valid, user found — continue to the actual route handler
    } catch (error) {
      // return stops the function here so we never send a second response below
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
