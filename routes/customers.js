const express = require("express");
const { Customer, validate } = require("../models/customer");

const router = express.Router();

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
  const { error } = validate(req.body);

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

module.exports = router;
