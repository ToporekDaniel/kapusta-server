const Expense = require('../models/Expense');
const expensesSchema = require('../models/expensesJoi'); // Importuj schemat walidacji

// Funkcja dodawania wydatków
const addExpense = async (req, res) => {
  try {
    // Walidacja danych wejściowych
    const { error } = expensesSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { description, amount, date, category } = req.body;

    const newExpense = new Expense({
      description,
      amount,
      date,
      category
    });

    await newExpense.save();

    // Tutaj możesz dodać logikę aktualizacji salda użytkownika itp.

    res.status(200).json({
      message: 'Expense added successfully',
      expense: newExpense
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addExpense
};
