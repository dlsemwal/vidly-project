const express = require("express");
const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const auth = require("../middleware/auth");
const VerificationToken = require("../models/verification");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v");

  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("This user is already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const code = getRandomCode(6);
  const verificationToken = new VerificationToken({
    _userId: user._id,
    token: code
  });

  try {
    await verificationToken.save(err => {
      if (err) return console.log("verification token saving  failed");
      console.log("saved");
      user.sendVerificationMail(code);
    });
  } catch (ex) {
    console.log("verification code could not be sent.");
  }

  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send({
    user: _.pick(user, ["_id", "name", "email"]),
    message: "Confirmation mail has been sent"
  });
});

// router.put("/:id", async (req, res) => {
//   let id = req.params.id;

//   const { error } = validate(req.body);

//   if (error) return res.status(400).send(error.details[0].message);

//   const genre = await User.findByIdAndUpdate(
//     id,
//     { name: req.body.name },
//     { new: true }
//   );

//   res.send(genre);
// });

// router.delete("/:id", async (req, res) => {
//   const genre = await User.findByIdAndRemove(req.params.id);

//   if (!genre) return res.status(404).send("The genre was not found!!!");

//   res.send(genre);
// });

router.post("/confirmation", auth, async (req, res) => {
  const verificationToken = await VerificationToken.findOne({
    _userId: req.user._id,
    token: req.body.token
  });

  if (!verificationToken)
    return res.status(400).send("This confirmation code  is not valid.");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        isVerified: true
      }
    },
    { new: true }
  ).select("-password -__v");

  res.send(user);
});

function getRandomCode(n) {
  let code = Math.random();
  code = code < 0.1 ? 1 - code : code;
  return Math.round(code * 10 ** n);
}

module.exports = router;
