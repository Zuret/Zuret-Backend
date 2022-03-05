const Tour = require("../models/tourModel");
const APIFeature = require("../utils/apiFeatures");

//Get 5 Tours that are highly rated and cheap------------------
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

//Get all Tours------------------------------------------------
exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    console.error(`ERROR: ${err}`);
    res.status(404).json({
      status: "fail",
      massage: "Invalid data sent to server",
    });
  }
};
//Get Tour by ID------------------------------------------------
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (err) {
    console.error(err);
    res.status(404),
      res.status(200).json({
        status: "success",
        massage: "Invalid data sent to server",
      });
  }
};

//Create Tour------------------------------------------------
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: "success",
      data: newTour,
    });
  } catch (err) {
    console.log(`ERROR: ${err}`);
    res.status(404).json({
      status: "fail",
      massage: "Invalid data sent to server",
    });
  }
};

//Update Tour by ID------------------------------------------------
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (err) {
    console.log(`ERROR: ${err}`);
    res.status(404).json({
      status: "fail",
      massage: "Invalid data sent to server",
    });
  }
};

//Delete Tour by ID------------------------------------------------
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.log(`ERROR: ${err}`);
    res.status(404).json({
      status: "fail",
      massage: "Invalid data sent to server",
    });
  }
};

//Create stat data of tours------------------------------
exports.getTourStat = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(`ERROR: ${err}`);
    res.status(404).json({
      status: "fail",
      massage: "Invalid data sent to server",
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
          }
        }
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
      results:plan.length,
      data: plan,
    });
  } catch (err) {
    console.log(`ERROR: ${err}`);
    res.status(404).json({
      status: "fail",
      massage: "Invalid data sent to server",
    });
  }
};
