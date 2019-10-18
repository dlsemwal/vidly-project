require("winston-mongodb");

const cors = require("cors");
const winston = require("winston");
const express = require("express");
const morgan = require("morgan");
const config = require("config");
const debug = require("debug")("app:startup");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const mongoose = require("mongoose");
const Joi = require("joi");
const error = require("./middleware/error");

winston.add(new winston.transports.File({ filename: "logfile.log" }));
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
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", ex => {
  throw ex;
});

// throw new Error("uncaughtException");
// Promise.reject("unhandledRejection");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.....");
  process.exit(1);
}

Joi.objectId = require("joi-objectid")(Joi);

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("connected to mongodb...."))
  .catch(err => console.log("couldn't connected to mongodb......"));

const app = express();

// console.log(`Environment: ${process.env.NODE_ENV}`);
// console.log(`App Name: ${config.get("name")}`);
// console.log(`App Mail Server: ${config.get("mail.host")}`);
// console.log(`App Mail Password: ${config.get("mail.password")}`);

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "x-auth-token"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);

app.use(express.json());
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled......");
}

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running on ${port} port......`);
});
