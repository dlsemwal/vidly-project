const asyncMiddleware = require("../middleware/async");
const { Genre, validate } = require("../models/genre");

const controller = {};

controller.list = asyncMiddleware(async (req, res) => {
  // throw new Error("couldn't get genres.....");
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

controller.genre = async (req, res) => {
  const id = req.params.id;
  const genre = await Genre.findById(id);

  if (!genre) return res.status(404).send("The genre was not found!!!");
  res.send(genre);
};

controller.create = async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name /*, img: req.file.filename*/ });
  await genre.save();

  res.send(genre);
};

controller.update = async (req, res) => {
  let id = req.params.id;

  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    id,
    { name: req.body.name },
    { new: true }
  );

  res.send(genre);
};

controller.delete = async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send("The genre was not found!!!");

  res.send(genre);
};

module.exports = controller;
