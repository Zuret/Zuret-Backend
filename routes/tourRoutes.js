const express = require("express");
const tourController = require("../controllers/tourController.js");
const authController = require("../controllers/authController.js");

const tourRouter = express.Router();

tourRouter
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter.route("/get-stat").get(tourController.getTourStat);

tourRouter.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

tourRouter
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
tourRouter
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
