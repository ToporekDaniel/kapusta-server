const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', authController.auth, authController.logout);

router.post('/refresh', authController.verifyRefreshToken, authController.refresh);

module.exports = router;