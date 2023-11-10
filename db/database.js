const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Mybrary", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connection to database is successful");
  })
  .catch((error) => {
    console.log(error);
  });
