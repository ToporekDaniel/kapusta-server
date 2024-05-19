const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');

// Aktualizacja bilansu
router.post('/', balanceController.updateBalance);

// Odczyt bilansu
router.get('/', balanceController.getBalance);

module.exports = router;
