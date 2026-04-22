const express = require("express");
const app = express();

const studentRoutes = require("./routes/student.routes");
const authRoutes = require("./routes/auth.routes");
const logger = require("./middleware/logger.middleware");
const errorHandler = require("./middleware/error.middleware");
const notFound = require("./middleware/notFound.middleware");

// CORS - Allow frontend to communicate with backend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(logger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;