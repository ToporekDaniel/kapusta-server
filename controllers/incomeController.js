const Income = require('../models/Income');

// Funkcja dodawania przychodów
const addIncome = async (req, res) => {
  try {
    const { description, amount, date } = req.body;

    const newIncome = new Income({
      description,
      amount,
      date
    });

    await newIncome.save();

    res.status(200).json({
      newBalance: 100, // newBalance spiąć z wartością (teraz jest sztywna wartość)
      transaction: newIncome
    });
  } catch (error) {
    console.error('Error adding income:', error);
    res.status(400).json({ message: 'Bad request' });
  }
};

module.exports = {
  addIncome
};

// Funkcja pobierania przychodów
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find();


    res.status(200).json({
      incomes,
      monthStats: {
        "January": 5,
        "February": 100,
        "March": "N/A",
        "April": "N/A",
        "May ": 1,
        "June ": "N/A",
        "July": 3,
        "August": "N/A",
        "September": "N/A",
        "October": 77,
        "November": "N/A",
        "December": 123 // Na razie ustawione sztywne wartości 
      }
    });
  } catch (error) {
    console.error('Error getting incomes:', error);
    res.status(400).json({ message: 'Bad request' });
  }
};

module.exports = {
  getIncomes
};