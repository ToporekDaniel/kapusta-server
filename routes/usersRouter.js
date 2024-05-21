const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.patch("/balance", userController.changeBalance);

router.get("/", userController.user);

module.exports = router;
