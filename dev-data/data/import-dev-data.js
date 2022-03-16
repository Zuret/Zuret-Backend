const mongoose = require("mongoose");
const fs = require("fs")
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");

process.on("uncaughtException", (err) => {
  console.log("Unhandled rejection error: Server Shuting down....");
  console.log(err.name, err.message);
  process.exit(1);
});

const db = "mongodb://localhost:27017/natours";
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB connected successfully");
  });

//Get data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

//Import data
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data created successfully");
  } catch (err) {
    console.log("Error: " + err.message);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data deleted successfully");
  } catch (err) {
    console.log("Error: " + err.message);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
