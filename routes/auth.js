const express = require("express");
const auth = require("../middleware/auth");
const controller = require("../controllers/auth");

const router = express.Router();

router.post("/", controller.login);

router.delete("/", [auth], controller.logout);



module.exports = router;
