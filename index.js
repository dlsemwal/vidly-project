const express = require("express");
const morgan = require("morgan");
const config = require("config");
const debug = require("debug")("app:startup");
const genres = require("./routes/genres");

const app = express();

console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`App Name: ${config.get("name")}`);
console.log(`App Mail Server: ${config.get("mail.host")}`);
console.log(`App Mail Password: ${config.get("mail.password")}`);

app.use(express.json());
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled......");
}
app.use("/api/genres", genres);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running on ${port} port......`);
});
