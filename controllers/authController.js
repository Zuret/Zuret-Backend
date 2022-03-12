const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, "this-is-the-super-duper-secret-string", {
    expiresIn: "90d",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie("JWT", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    secure: false,   //TODO  secure this must be set to true when deployed to server 
    httpOnly: true,
  });

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token: token,
    data: {
      User: user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  console.log("protect is reached");

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

  //check if the user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "the user belonging to the token does not exist anymore",
        401
      )
    );
  }

  //check if the user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please login again ", 401)
    );
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "The user does not have permission to perform this action",
          403
        )
      );
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // get user based on POSTed email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("The user with this email does not exist", 404));
  }

  //Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send the user email

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  let message = `Forget your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.\nIf you did not forget your password please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset Token (valid for 10 minuets)",
      message: message,
    });
    res.status(200).json({
      status: "success",
      massage: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;

    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There were an error sending token to email", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on token
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpiresAt: { $gt: Date.now() },
  });

  //if token has not expire and user exists, set the new password
  if (!user) {
    console.log("not user");
    return next(new AppError("Token is invalid or expired", 400));
  }
  console.log(`reset password user: ${user.password}`);
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;
  console.log("not not user");
  await user.save();

  //log the user in , send JWT
  createSendToken(user._id, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  console.log("updatePassword is reached");
  //Check if old & new password exists
  if (!req.body.oldPassword || !req.body.newPassword) {
    return next(new AppError("please provide old and new password", 400));
  }

  //Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  //check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.oldPassword, user.password))) {
    return next(new AppError("please provide a correct password", 401));
  }
  //Update password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  //log user in send Token
  createSendToken(user, 200, res);
});
