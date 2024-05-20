const express = require("express");
const router = express.Router();

const incomeController = require("../controllers/incomeController");

//aytoryzacja została dodana w app.js

// Endpoint do dodawania nowego przychodu
router.post("/income", incomeController.addIncome);

// Endpoint do pobierania przychodów
router.get("/income", incomeController.getIncomes);

// Endpoint do usuwania przychodu
router.delete("/income/:id", incomeController.deleteIncome);

// Endpoint do aktualizacji przychodu
// router.put('/income/:id', incomeController.updateIncome);



module.exports = router;
