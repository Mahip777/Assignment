const mongoose = require('mongoose');
const port = 3001;
const uri = process.env.DB;

mongoose.connect(uri, {
  useNewUrlParser: true,
//   useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully.");
});