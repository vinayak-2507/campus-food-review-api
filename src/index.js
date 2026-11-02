require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3000;

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set. Add it to your local .env file.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected successfully.");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  // Never print the connection URI: driver errors can contain connection details.
  console.error("Server startup failed:", error.name || "Error", error.code || "");
  process.exitCode = 1;
});
