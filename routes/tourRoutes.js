const express = require("express");
const tourController = require("../controllers/tourController.js");
const authController = require("../controllers/authController.js");
const reviewController = require("../controllers/reviewController.js");
const reviewRouter = require("../routes/reviewRoutes");
const tourRouter = express.Router();

tourRouter.use("/:tourId/reviews", reviewRouter);
tourRouter
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter.route("/get-stat").get(tourController.getTourStat);

tourRouter
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan
  );

tourRouter
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour
  );
tourRouter
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = tourRouter;
