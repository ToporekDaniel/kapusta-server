const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');

// Endpoint do dodawania nowego przychodu
router.post('/income', incomeController.addIncome);

module.exports = router;
