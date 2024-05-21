const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

// Podsumowanie finansowe
router.get('/', summaryController.getSummary);

// Podsumowanie wydatków
router.get('/expenses', summaryController.getExpenseSummary);

module.exports = router;
