const mongoose = require("mongoose");

// User schema — defines what a user document looks like in MongoDB
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true, // removes whitespace from both ends
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // no two users can have the same email
    lowercase: true, // "Saurabh@Gmail.com" → "saurabh@gmail.com"
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["user", "admin"], // only these two values allowed
    default: "user", // every new signup is a regular user
  },
}, {
  timestamps: true, // auto-adds createdAt and updatedAt fields
});

module.exports = mongoose.model("User", userSchema);
