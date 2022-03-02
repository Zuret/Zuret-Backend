const mongoose = require('mongoose');
const app = require('./app.js')

const db = "mongodb://localhost:27017/natours";
mongoose.connect(db, {
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false,
}).then(con => {
  console.log(con.connections);
  console.log("DB connected successfully");
})

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});