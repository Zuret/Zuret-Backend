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
    // //filtering------------------------------------------------
    // const queryObj = { ...req.query };
    // const excludedFields = ["page", "sort", "limit", "fields"];
    // excludedFields.forEach((field) => delete queryObj[field]);

    // //advanced filtering------------------------------------------------
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(
    //   /\b(gte|lte|gt|lt)\b/g,
    //   (matches) => `$${matches}`
    // );
    // queryStr = JSON.parse(queryStr);

    // //-----------------------------------------------------------------
    // let query = Tour.find(queryStr);

    // //sorting------------------------------------------------
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("-createdAt");
    // }

    // //limiting fields------------------------------------------------
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }

    // //pagination------------------------------------------------
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const toursNum = await Tour.countDocuments();
    //   if (skip >= toursNum) throw new Error("This page does not exist");
    // }

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
