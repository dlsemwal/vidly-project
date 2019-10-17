const { InvalidToken } = require("../models/blacklist");

module.exports = function(req, res, next) {
  const token = InvalidToken.findOne({ token: req.header("x-auth-token") });

  if (token) return res.status(400).send("Invalid token!!!");

  next();
};
