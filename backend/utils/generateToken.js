const jwt = require("jsonwebtoken");

// Creates a JWT token that contains the user's ID
// This token is sent to the frontend and stored — it proves "I am logged in as user X"
// expiresIn: "30d" means the user stays logged in for 30 days before needing to login again
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
