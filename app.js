const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const tourRouter = require("./routes/tourRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const reviewRouter = require("./routes/reviewRoutes.js");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController.js");

const app = express();

app.use(helmet());

//body parser according to size
app.use(express.json({ limit: "10kb" }));

//Data sanitization against NoSql Query injection
app.use(mongoSanitize());

//Data sanitization against Xss
app.use(xss());

//prevent parameter population
app.use(
  hpp({
    whitelist: [
      "duration",
      "maxGroupSize",
      "ratingsAverage",
      "ratingsQuantity",
      "difficulty",
      "price",
    ],
  })
);

//Serving static data
app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/review", reviewRouter);

//FIXME make the limiter work
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to API calls only
app.use("/api", apiLimiter);

//404 error handler
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} in the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
