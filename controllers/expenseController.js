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

    // Miejsce na logikę aktualizacji salda użytkownika itp.

    res.status(200).json({
      message: 'Expense added successfully',
      expense: newExpense
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Funkcja pobierania wydatków
const getExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date, category } = req.query;

    const query = { userId };
    if (date) {
      query.date = date;
    }
    if (category) {
      query.category = category;
    }

    const expenses = await Expense.find(query);

    // Obliczanie statystyk miesięcznych
    const monthStats = {
      "January": 0,
      "February": 0,
      "March": 0,
      "April": 0,
      "May": 0,
      "June": 0,
      "July": 0,
      "August": 0,
      "September": 0,
      "October": 0,
      "November": 0,
      "December": 0
    };

    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'long' });
      monthStats[month] += expense.amount;
    });

    res.status(200).json({
      expenses,
      monthStats
    });
  } catch (error) {
    console.error('Error getting expenses:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Funkcja usuwania wydatków
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Miejsce na logikę aktualizacji salda użytkownika itp.
    const newBalance = 0; 

    res.status(200).json({ newBalance });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense
};