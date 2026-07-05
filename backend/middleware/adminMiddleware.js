// This middleware runs AFTER authMiddleware (so req.user already exists)
// It checks: "Is this user an admin?"
// Used on routes like /api/admin/* that only admins should access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // User is admin, continue
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { adminOnly };
