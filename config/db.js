/**
 * MongoDB Database Connection
 * Uses mongoose to connect to MongoDB Atlas
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    // Connect to MongoDB Atlas
    const conn = await mongoose.connect(mongoURI, {
      // Mongoose 6+ uses these options by default
      // But explicitly setting for clarity
      maxPoolSize: 10, // Maximum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000, // Socket timeout
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    return conn;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:");
    console.error("   ", error.message);
    
    // Graceful exit - don't crash silently
    process.exit(1);
  }
};

module.exports = connectDB;