const express = require("express");
const Joi = require("joi");
const { User } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const { InvalidToken } = require("../models/blacklist");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

router.delete("/", [auth], async (req, res) => {
  try {
    const token = new InvalidToken({ token: req.header("x-auth-token") });
    await token.save();

    res.send("Successfully logged out !!!");
  } catch (ex) {
    res.status(400).send("Invalid request!!!");
  }
});

function validate(user) {
  const schema = {
    email: Joi.string()
      .required()
      .min(5)
      .max(255)
      .email(),
    password: Joi.string()
      .required()
      .min(5)
      .max(255)
  };
  return Joi.validate(user, schema);
}

module.exports = router;
