const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
      trim: true
    },
    isGold: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
      trim: true
    }
  })
);

function validateCustomer(genre) {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(50),
    isGold: Joi.boolean(),
    phone: Joi.string()
      .required()
      .min(5)
      .max(50)
  };
  return Joi.validate(genre, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
