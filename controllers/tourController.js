const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//check if the Id is valid
exports.checkId = (req, res, next, id) => {
  console.log(`Checking ${id}`);

  if (id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  next();
};
//check the body for a name and a price
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(500).json({
      status: "fail",
      massage: "Name and Price are missing",
    })
  }
  next();
}

//Get all Tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    result: tours.length,
    data: tours,
  });
};

//Get Tour by ID
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    data: tour,
  });
};

//Create Tour
exports.createTour = (req, res) => {
  const newId = tours.length;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: newTour,
      });
    }
  );
};

//Update Tour by ID
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "< UPDATE tour here >",
  });
};

//Delete Tour by ID
exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "< DELETE tour here >",
  });
};
