const Tour = require("../models/tourModel");

//Get all Tours
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
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
//Get Tour by ID
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

//Create Tour
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

//Update Tour by ID
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

//Delete Tour by ID
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
