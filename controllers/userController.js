const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //sending------------------------------------------------
  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //create error if user POSTed password to be changed
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password update. Please use /UpdatePassword",
        400
      )
    );
  }
  //filter out any unwanted change request other that email and password
  const filteredData = filterObj(req.body, "name", "email");

  //update user data
  const user = await User.findByIdAndUpdate(req.user.id, filteredData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.deleteMe = catchAsync (async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, { active: false})
    
    res.status(204).json({
        status: "success",
        data: null,
      });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    massage: "This Route is not yet defined",
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    massage: "This Route is not yet defined",
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    massage: "This Route is not yet defined",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    massage: "This Route is not yet defined",
  });
};
