const morgan = require("morgan");
const debug = require("debug")("app:startup");

module.exports = app => {
  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Morgan enabled......");
  }
};
