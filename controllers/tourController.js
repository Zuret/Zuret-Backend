const Tour = require("../models/tourModel");
const APIFeature = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

//Get 5 Tours that are highly rated and cheap------------------
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

//Get all Tours------------------------------------------------
exports.getAllTours = catchAsync(async (req, res, next) => {
  //constructing------------------------------------------------
  const feature = new APIFeature(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await feature.query;

  //sending------------------------------------------------
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: tours,
  });
});

//Get Tour by ID------------------------------------------------
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tours) {
    next(new AppError("No tour found with that Id", 404));
  }

  res.status(200).json({
    status: "success",
    data: tour,
  });
});

//Create Tour------------------------------------------------
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(200).json({
    status: "success",
    data: newTour,
  });
});

//Update Tour by ID------------------------------------------------
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tours) {
    next(new AppError("No tour found with that Id", 404));
  }

  res.status(200).json({
    status: "success",
    data: tour,
  });
});

//Delete Tour by ID------------------------------------------------
exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);

  if (!tours) {
    next(new AppError("No tour found with that Id", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

//Create stat data of tours------------------------------
exports.getTourStat = catchAsync(async (req, res, next) => {
  const stat = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsAverage" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: stat,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  console.log(year);
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: null,
        // _id: { $month: "$startDates" },
        numTours: { $sum: 1 },
        Tours: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        month: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: plan.length,
    data: plan,
  });
});
