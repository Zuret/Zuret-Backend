const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeature = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(`No document found with that Id ${req.params.id}`, 404)
      );
    }

    res.status(204).json({
      status: "success",
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      next(new AppError("No document found with that Id", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(200).json({
      status: "success",
      data: newDoc,
    });
  });

exports.getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOption) query = query.populate(popOption);
    const doc = await query;

    if (!doc) {
      return next(
        new AppError(`No document found with that Id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.getAll = Model => catchAsync(async (req, res, next) => {
    //constructing------------------------------------------------
    const feature = new APIFeature(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await feature.query;
  
    //sending------------------------------------------------
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  });
  