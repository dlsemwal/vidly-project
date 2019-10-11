const express = require("express");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const movie = await Movie.findById(id);

  if (!movie) return res.status(404).send("The movie was not found!!!");
  res.send(movie);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre!!!");

  let movies = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  movies = await movies.save();

  res.send(movies);
});

// router.put("/:id", async (req, res) => {
//   let id = req.params.id;

//   const { error } = validate(req.body);

//   if (error) return res.status(400).send(error.details[0].message);

//   const genre = await Movie.findByIdAndUpdate(
//     id,
//     { name: req.body.name },
//     { new: true }
//   );

//   res.send(genre);
// });

// router.delete("/:id", async (req, res) => {
//   const genre = await Movie.findByIdAndRemove(req.params.id);

//   if (!genre) return res.status(404).send("The genre was not found!!!");

//   res.send(genre);
// });

module.exports = router;
