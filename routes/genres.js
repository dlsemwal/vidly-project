const EventEmitter = require("events");
const emitter = new EventEmitter();

// const { upload } = require("../middleware/upload");
const validateObjectId = require("../middleware/validateObjectId");

const express = require("express");
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

const router = express.Router();

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    // throw new Error("couldn't get genres.....");
    const genres = await Genre.find().sort("name");
    res.send(genres);
    emitter.emit("genre", {
      method: "GET",
      message: "Genre event has been raised by someone"
    });
  })
);

router.get("/:id", validateObjectId, async (req, res) => {
  const id = req.params.id;
  const genre = await Genre.findById(id);

  if (!genre) return res.status(404).send("The genre was not found!!!");
  res.send(genre);
});

router.post("/", auth /*, upload.single("image")*/, async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name /*, img: req.file.filename*/ });
  await genre.save();

  res.send(genre);
});

router.put("/:id", async (req, res) => {
  let id = req.params.id;

  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    id,
    { name: req.body.name },
    { new: true }
  );

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send("The genre was not found!!!");

  res.send(genre);
});

emitter.on("genre", data => {
  console.log(data);
});

module.exports = router;
