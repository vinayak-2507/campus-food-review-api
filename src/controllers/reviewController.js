const mongoose = require("mongoose");
const Review = require("../models/Review");

const reviewFields = ["name", "location", "category", "rating", "price", "review"];

function validateReviewInput(body, { partial = false } = {}) {
  const errors = [];
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return ["Request body must be a JSON object."];
  }

  for (const key of Object.keys(body)) {
    if (!reviewFields.includes(key)) errors.push(`Unknown field: ${key}.`);
  }
  for (const field of reviewFields) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) {
      if (!partial) errors.push(`${field} is required.`);
      continue;
    }
    const value = body[field];
    if (["name", "location", "category", "review"].includes(field)) {
      if (typeof value !== "string" || value.trim() === "") {
        errors.push(`${field} must be a non-empty string.`);
      }
    } else if (typeof value !== "number" || !Number.isFinite(value)) {
      errors.push(`${field} must be a number.`);
    } else if (field === "rating" && (value < 1 || value > 5)) {
      errors.push("rating must be between 1 and 5.");
    } else if (field === "price" && value < 0) {
      errors.push("price cannot be negative.");
    }
  }
  if (partial && Object.keys(body).length === 0) errors.push("Provide at least one field to update.");
  return errors;
}

function validateId(id) {
  return mongoose.isValidObjectId(id);
}

async function getReviews(req, res, next) {
  try {
    const filter = {};
    if (req.query.category !== undefined) {
      if (typeof req.query.category !== "string" || req.query.category.trim() === "") {
        return res.status(400).json({ success: false, message: "category filter must be a non-empty string." });
      }
      filter.category = new RegExp(`^${req.query.category.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
    }
    if (req.query.rating !== undefined) {
      const rating = Number(req.query.rating);
      if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: "rating filter must be a number from 1 to 5." });
      }
      filter.rating = rating;
    }
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    return next(error);
  }
}

async function getReview(req, res, next) {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid review ID." });
    }
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    return res.status(200).json({ success: true, data: review });
  } catch (error) {
    return next(error);
  }
}

async function createReview(req, res, next) {
  const errors = validateReviewInput(req.body);
  if (errors.length) return res.status(400).json({ success: false, message: "Validation failed.", errors });
  try {
    const review = await Review.create(req.body);
    return res.status(201).json({ success: true, data: review });
  } catch (error) {
    return next(error);
  }
}

async function updateReview(req, res, next) {
  const errors = validateReviewInput(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ success: false, message: "Validation failed.", errors });
  if (!validateId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid review ID." });
  }
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    return res.status(200).json({ success: true, data: review });
  } catch (error) {
    return next(error);
  }
}

async function deleteReview(req, res, next) {
  if (!validateId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid review ID." });
  }
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    return res.status(200).json({ success: true, message: "Review deleted successfully.", data: review });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getReviews, getReview, createReview, updateReview, deleteReview };
