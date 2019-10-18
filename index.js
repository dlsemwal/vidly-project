const winston = require("winston");
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config");
require("./startup/validation");
require("./startup/cors")(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  winston.info(`server is running on ${port} port......`);
});

function sendMail(address, htmlMessage) {
  var transporter = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
      user: "demo@gmail.com",
      pass: "password"
    }
  });
  var message = {
    from: "you@yourdomain.io",
    to: address,
    subject: "That was so quick!!",
    html: htmlMessage
  };
  transporter.sendMail(message, function(error, info) {
    if (error) console.log(error);
    transporter.close();
  });
}

sendMail("divyanshu.semwal@neosofttech.com", "This is demo...");
