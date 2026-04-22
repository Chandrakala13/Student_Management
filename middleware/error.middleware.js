/**
 * Global Error Handler Middleware
 * Handles all errors from the application
 */

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);
  console.error("Stack:", err.stack);

  // Mongoose specific errors
  if (err.name === "CastError") {
    // Invalid MongoDB ObjectId
    return res.status(400).json({
      message: "Invalid ID format",
      error: err.message,
    });
  }

  if (err.name === "ValidationError") {
    // Mongoose validation errors
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      message: "Validation error",
      errors: messages,
    });
  }

  if (err.code === 11000) {
    // MongoDB duplicate key error
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `Duplicate value for ${field}`,
      field,
    });
  }

  if (err.name === "MongoServerError") {
    // General MongoDB errors
    return res.status(500).json({
      message: "Database error",
      error: err.message,
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;