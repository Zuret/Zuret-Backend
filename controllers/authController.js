const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, "this-is-the-super-duper-secret-string", {
    expiresIn: "90d",
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token: token,
    data: {
      User: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //Check if email & password exists
  if (!email || !password) {
    return next(new AppError("please provide an email and password", 400));
  }
  //check if user exists and password is correct
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError("please provide a correct email and password", 401)
    );
  }

  //send token
  token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //getting token and check if its there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
 
  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to get access"),
      401
    );
  }

  //token verification
  const decoded = await promisify(jwt.verify)(
    token,
    "this-is-the-super-duper-secret-string"
  ); 
  console.log(decoded);

  //check id the user still exist
  const currentUser = await User.findById(decoded.id);
  if(!currentUser){
    return next( new AppError("the user belonging to the token does not exist anymore",401))
  }

  //check if the user changed password after the token was issued
  if(currentUser.changedPasswordAfter(decoded.iat)){
    return next( new AppError("User recently changed password! Please login again ",401));

  }
  req.user = currentUser;
  next();
});
