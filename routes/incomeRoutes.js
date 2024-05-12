const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint do dodawania nowego przychodu
router.post('/income', incomeController.addIncome);

// Endpoint do pobierania przychodów
router.get('/income', incomeController.getIncomes);

// Endpoint do usuwania przychodu
router.delete('/income/:id', authMiddleware.checkAuth, incomeController.deleteIncome);

// Endpoint do aktualizacji przychodu
router.put('/income/:id', authMiddleware.checkAuth, incomeController.updateIncome);

module.exports = router;
