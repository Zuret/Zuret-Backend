const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cant be empty"],
    },
    rating: {
      type: Number,
      maxLength: [5, "The must be equal or less than 5"],
      minLength: [1, "The must be  equal or greater than 1"],
    },
    CreatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "A Review must belong to a tour"],
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A Review must belong to a user"],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next(); 
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
