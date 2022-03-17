const express = require("express");
const reviewController = require("../controllers/reviewController.js");
const authController = require("../controllers/authController.js");

const reviewRouter = express.Router({ mergeParams: true });

//protect the routes bellow by checking for authorization
reviewRouter.use(authController.protect);

reviewRouter
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserId,
    reviewController.createReview
  );

reviewRouter
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("admin", "user"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("admin", "user"),
    reviewController.deleteReview
  );

module.exports = reviewRouter;
