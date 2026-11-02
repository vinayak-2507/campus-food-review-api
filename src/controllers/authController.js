const bcrypt = require("bcryptjs");
const User = require("../models/User");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegistration(body) {
  const errors = [];
  if (!body || typeof body !== "object" || Array.isArray(body)) return ["Request body must be a JSON object."];
  for (const field of Object.keys(body)) {
    if (!["name", "email", "password"].includes(field)) errors.push(`Unknown field: ${field}.`);
  }
  if (typeof body.name !== "string" || body.name.trim().length < 2 || body.name.trim().length > 100) {
    errors.push("name must be a string between 2 and 100 characters.");
  }
  if (typeof body.email !== "string" || !emailPattern.test(body.email.trim()) || body.email.length > 254) {
    errors.push("A valid email address is required.");
  }
  if (typeof body.password !== "string" || body.password.length < 8 || body.password.length > 72) {
    errors.push("password must be between 8 and 72 characters.");
  }
  return errors;
}

async function register(req, res, next) {
  const errors = validateRegistration(req.body);
  if (errors.length) return res.status(400).json({ success: false, message: "Validation failed.", errors });
  try {
    const user = await User.create({
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      password: await bcrypt.hash(req.body.password, 12),
    });
    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      data: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({ success: false, message: "Request body must be a JSON object." });
  }
  const { email, password } = req.body;
  if (typeof email !== "string" || !emailPattern.test(email.trim()) || typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ success: false, message: "A valid email and password are required." });
  }
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login };
