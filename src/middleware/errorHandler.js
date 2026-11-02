function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Request body contains invalid JSON." });
  }
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "An account with that email already exists." });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid value supplied." });
  }

  console.error("Request failed:", error.name || "Error");
  return res.status(500).json({ success: false, message: "Internal server error." });
}

module.exports = errorHandler;
