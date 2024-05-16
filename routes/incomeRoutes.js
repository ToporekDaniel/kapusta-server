const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const { checkAuth } = require('../middleware/authMiddleware');

// Endpoint do dodawania nowego przychodu
router.post('/income', checkAuth, incomeController.addIncome);

// Endpoint do pobierania przychodów
router.get('/income', checkAuth, incomeController.getIncomes);

// Endpoint do usuwania przychodu
router.delete('/income/:id', checkAuth, incomeController.deleteIncome);

// Endpoint do aktualizacji przychodu
// router.put('/income/:id', checkAuth, incomeController.updateIncome);

module.exports = router;
