const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");

const router = express.Router();

const customerSchema = new mongoose.Schema({
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
});

const Customer = mongoose.model("Customer", customerSchema);

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

// router.get("/:id", async (req, res) => {
//   const id = req.params.id;
//   const genre = await Genre.findById(id);

//   if (!genre) return res.status(404).send("The genre was not found!!!");
//   res.send(genre);
// });

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  customer = await customer.save();

  res.send(customer);
});

// router.put("/:id", async (req, res) => {
//   let id = req.params.id;

//   const { error } = validateGenre(req.body);

//   if (error) return res.status(400).send(error.details[0].message);

//   const genre = await Genre.findByIdAndUpdate(
//     id,
//     { name: req.body.name },
//     { new: true }
//   );

//   res.send(genre);
// });

// router.delete("/:id", async (req, res) => {
//   const genre = await Genre.findByIdAndRemove(req.params.id);

//   if (!genre) return res.status(404).send("The genre was not found!!!");

//   res.send(genre);
// });

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

module.exports = router;
