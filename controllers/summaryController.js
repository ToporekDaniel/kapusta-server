const Expense = require('../models/Expense');
const Income = require('../models/Income');

// Funkcja podsumowania finansowego
const getSummary = async (req, res) => {
  try {
    const { period } = req.query; // Okres, np. "monthly", "yearly"

    // Miejsce na logikę do generowania podsumowania w zależności od okresu

    // Przykładowe podsumowanie (demo)
    const summary = {
      monthlyExpenses: 500,
      monthlyIncome: 1500,
      monthlyBalance: 1000
    };

    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error getting summary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Funkcja podsumowania wydatków dla określonego miesiąca i kategorii
const getExpenseSummary = async (req, res) => {
  try {
    const { month, category } = req.query;

    const expenses = await Expense.find({ month, category });

    // Obliczanie sumy wydatków dla danej kategorii
    let totalExpense = 0;
    expenses.forEach(expense => {
      totalExpense += expense.amount;
    });

    res.status(200).json({ totalExpense });
  } catch (error) {
    console.error('Error getting expense summary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getSummary,
  getExpenseSummary
};
