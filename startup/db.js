const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/doneWithIt", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      winston.info("Connected to MongoDB");
    });
};
