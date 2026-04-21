const express = require("express");
const app = express();

const studentRoutes = require("./routes/student.routes");
const logger = require("./middleware/logger.middleware");
const errorHandler = require("./middleware/error.middleware");
const notFound = require("./middleware/notFound.middleware");

app.use(express.json());
app.use(logger);

app.use("/api/students", studentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;