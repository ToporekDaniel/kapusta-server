const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Endpoint do pobierania kategorii przychodów
router.get('/income-categories', categoryController.getIncomeCategories);

// Endpoint do pobierania kategorii wydatków
router.get('/expense-categories', categoryController.getExpenseCategories);

module.exports = router;