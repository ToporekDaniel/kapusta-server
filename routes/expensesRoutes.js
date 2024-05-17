// routes/expensesRoutes.js
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');


// Endpoint do dodawania nowego wydatku
router.post('/', expenseController.addExpense);

// Endpoint do pobierania wydatków
router.get('/', expenseController.getExpenses);

module.exports = router;
