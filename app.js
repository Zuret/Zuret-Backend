const express = require("express");
const tourRouter = require("./routes/tourRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController.js");

const app = express();

app.use(express.json());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);


//404 error handler
app.all("*", (req, res, next) => {
  
    next(new AppError(`Cant find ${req.originalUrl} in the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
