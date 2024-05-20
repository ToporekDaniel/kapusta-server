const express = require("express");
const router = express.Router();

const incomeController = require("../controllers/incomeController");

//aytoryzacja została dodana w app.js

// Endpoint do dodawania nowego przychodu
router.post('/', incomeController.addIncome);

// Endpoint do pobierania przychodów
router.get('/', incomeController.getIncomes);

// Endpoint do usuwania przychodu
router.delete('/:id', incomeController.deleteIncome);

// Endpoint do aktualizacji przychodu
// router.put('/income/:id', incomeController.updateIncome);



module.exports = router;
