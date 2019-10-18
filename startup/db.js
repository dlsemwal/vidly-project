const mongoose = require("mongoose");
const winston = require("winston");

module.exports = () => {
  mongoose
    .connect("mongodb://localhost/vidly", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    .then(() => winston.info("connected to mongodb...."));
};
