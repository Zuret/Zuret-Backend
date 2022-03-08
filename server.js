const mongoose = require("mongoose");
const app = require("./app.js");

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

const port = 3000;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection error: Server Shuting down....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
