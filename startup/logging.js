require("winston-mongodb");
require("express-async-errors");

const winston = require("winston");

module.exports = () => {
  winston.add(
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logfile.log" })
  );
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    })
  );

  winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", ex => {
    throw ex;
  });
};
