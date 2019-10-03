const express = require("express");
const Joi = require("joi");

const router = express.Router();

const genres = [
  { id: 1, name: "genre1" },
  { id: 2, name: "genre2" },
  { id: 3, name: "genre3" },
  { id: 4, name: "genre4" }
];

router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const genre = genres.find(e => e.id === parseInt(id));

  if (!genre) return res.status(404).send("The genre was not found!!!");
  res.send(genres);
});

router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let genre = {
    id: genres.length + 1,
    name: req.body.name
  };

  genres.push(genre);

  res.send(genre);
});

router.put("/:id", (req, res) => {
  let id = req.params.id;
  let genre = genres.find(e => e.id === parseInt(id));

  if (!genre) return res.status(404).send("genre was not found!!!");

  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const genre = genres.find(e => e.id === parseInt(id));

  if (!genre) return res.status(404).send("The genre was not found!!!");

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
  };
  return Joi.validate(genre, schema);
}

module.exports = router;
