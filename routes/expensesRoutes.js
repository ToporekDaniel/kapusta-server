// routes/expensesRoutes.js
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');


// Endpoint do dodawania nowego wydatku
router.post('/expense', expenseController.addExpense);

module.exports = router;
