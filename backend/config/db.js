const mongoose = require("mongoose");

// Connects to MongoDB Atlas using the URI from .env
// mongoose.connect() returns a promise — if it fails, we crash the server (no point running without a DB)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure — server can't work without DB
  }
};

module.exports = connectDB;
