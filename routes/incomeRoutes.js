const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
// const authMiddleware = require('../middleware/authMiddleware');

// Endpoint do dodawania nowego przychodu
router.post('/income', incomeController.addIncome);

// Endpoint do pobierania przychodów
router.get('/income', incomeController.getIncomes);

// Endpoint do usuwania przychodu
router.delete('/income/:id', incomeController.deleteIncome); // authMiddleware.checkAuth dodać jak będzie gotowu user

// Endpoint do aktualizacji przychodu
// router.put('/income/:id', incomeController.updateIncome); // authMiddleware.checkAuth dodać jak będzie gotowu user

module.exports = router;
