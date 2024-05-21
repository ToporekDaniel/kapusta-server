const Income = require('../models/Income');
const Expense = require('../models/Expense');

// Funkcja do generowania podsumowania
const getSummary = async (req, res) => {
  try {
    const { period } = req.query;  "yearly"
    const owner = req.user._id;

    const startDate = new Date();
    let endDate;

    if (period === "monthly") {
      startDate.setDate(1); 
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);
    } else if (period === "yearly") {
      startDate.setMonth(0, 1); 
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 1);
    } else {
      return res.status(400).json({ message: 'Invalid period' });
    }

    // Pobranie przychodów w określonym okresie
    const incomes = await Income.find({
      owner,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });

    // Pobranie wydatków w określonym okresie
    const expenses = await Expense.find({
      owner,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });

    // Obliczanie sum dla Income i Expenses
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome + totalExpenses;

    // Grupy wydatków według kategorii
    const expenseSummaryByCategory = expenses.reduce((summary, expense) => {
      const category = expense.category;
      if (!summary[category]) {
        summary[category] = 0;
      }
      summary[category] += expense.amount;
      return summary;
    }, {});

    const summary = {
      totalIncome,
      totalExpenses,
      balance,
      expenseSummaryByCategory
    };

    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error getting summary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Funkcja podsumowania wydatków dla danego miesiąca i kategorii
const getExpenseSummary = async (req, res) => {
  try {
    const { month, category } = req.query;
    const owner = req.user._id;

    const expenses = await Expense.find({ owner, month, category });

    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

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
