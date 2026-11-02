const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    location: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
    category: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    price: { type: Number, required: true, min: 0 },
    review: { type: String, required: true, trim: true, minlength: 5, maxlength: 2000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
