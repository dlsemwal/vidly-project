const EventEmitter = require("events");
const emitter = new EventEmitter();

const { upload } = require("../middleware/upload");
const validateObjectId = require("../middleware/validateObjectId");

const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const controller = require("../controllers/genres");

const router = express.Router();

router.get("/", controller.list);

router.get("/:id", validateObjectId, controller.genre);

router.post("/", auth, upload.single("image"), controller.create);

router.put("/:id", controller.update);

router.delete("/:id", [auth, admin], controller.delete);

emitter.on("genre", data => {
  console.log(data);
});

module.exports = router;
