const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  isVerified: { type: Boolean, default: false },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
};

userSchema.methods.sendVerificationMail = function(randomCode) {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "santoshs.neosoft@gmail.com",
      pass: "neosantosh@2012"
    }
  });
  var message = {
    from: "you@yourdomain.io",
    to: this.email,
    subject: "Confirm your email address on vidly.",
    html: `<h1>Email Confirmation</h1> <hr>
    <p>Your Verification code is ${randomCode}.`
  };
  transporter.sendMail(message, function(error, info) {
    if (error) console.log(error);
    transporter.close();
  });
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(50),
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

exports.User = User;
exports.validate = validateUser;
