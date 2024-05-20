const incomeCategories = [
  "Salary",
  "Additional income"
];

const expenseCategories = [
  "Products",
  "Alcohol",
  "Entertainment",
  "Health",
  "Transportation",
  "Home furnishings",
  "Technology",
  "Utilities and communications",
  "Sports and hobbies",
  "Education",
  "Other"
];

// Funkcja do pobierania kategorii przychodów
const getIncomeCategories = (req, res) => {
  try {
    res.status(200).json(incomeCategories);
  } catch (error) {
    console.error('Error fetching income categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Funkcja do pobierania kategorii wydatków
const getExpenseCategories = (req, res) => {
  try {
    res.status(200).json(expenseCategories);
  } catch (error) {
    console.error('Error fetching expense categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getIncomeCategories,
  getExpenseCategories
};