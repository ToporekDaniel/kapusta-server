const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');

// Endpoint do dodawania nowego przychodu
router.post('/income', incomeController.addIncome);

// Endpoint do pobierania przychodów
router.get('/income', incomeController.getIncomes);

module.exports = router;
