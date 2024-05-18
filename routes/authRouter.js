const express = require("express");
const authController = require("../controllers/authController");
const authMid = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authMid, authController.logout);

router.post('/refresh', authController.verifyRefreshToken, authController.refresh);

module.exports = router;
