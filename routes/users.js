const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/users");

router.get("/me", auth, controller.getUser);
router.post("/", controller.createUser);
router.post("/confirmation", auth, controller.verifyUser);
router.put("/me", auth, controller.updateUser);
router.delete("/:id", auth, controller.deleteUser);

module.exports = router;
