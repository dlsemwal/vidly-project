const config = require("config");

module.exports = () => {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.....");
  }

  // console.log(`Environment: ${process.env.NODE_ENV}`);
  // console.log(`App Name: ${config.get("name")}`);
  // console.log(`App Mail Server: ${config.get("mail.host")}`);
  // console.log(`App Mail Password: ${config.get("mail.password")}`);
};
