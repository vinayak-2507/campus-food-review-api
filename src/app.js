const express = require("express");
const mongoose = require("mongoose");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.status(200).send("Campus Food Review API is running and MongoDB is connected!");
});

app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "unavailable",
    message: "Campus Food Review API",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use(errorHandler);

module.exports = app;
