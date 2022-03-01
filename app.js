const express = require("express");
const tourRouter = require("./routes/tourRoutes.js")
const userRouter = require("./routes/userRoutes.js")

const app = express();

app.use(express.json());


app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
