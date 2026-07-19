const mongoose = require("mongoose");

// Connects to MongoDB Atlas using the URI from .env.
// If it fails, we stop the server because the API depends on the database.
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  if (process.env.MONGO_URI.includes("<db_password>")) {
    throw new Error(
      "MONGO_URI still contains <db_password>. Replace it with your real MongoDB Atlas password."
    );
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);

    if (error.message.includes("querySrv ECONNREFUSED")) {
      console.error(
        "Atlas SRV lookup failed. This usually means a local DNS or network issue."
      );
      console.error(
        "Switch DNS servers or replace mongodb+srv:// with a direct mongodb:// Atlas URI."
      );
    }

    process.exit(1);
  }
};

module.exports = connectDB;
