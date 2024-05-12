const Income = require('../models/Income');
const Joi = require('@hapi/joi');

// Walidacja dla danych wejściowych
const incomeSchema = Joi.object({
  description: Joi.string().min(1).max(300).required(),
  amount: Joi.number().min(1).max(1000000000).required(),
  date: Joi.date().iso().required()
});

// Funkcja dodawania przychodów
const addIncome = async (req, res) => {
  try {
    // Walidacja danych wejściowych
    const { error } = incomeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { description, amount, date } = req.body;

    const incomeMonth = new Date(date).getMonth();

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[incomeMonth];

    // Tworzenie nowego przychodu z dodanym miesiącem
    const newIncome = new Income({
      description,
      amount,
      date,
      month: monthName
    });

    await newIncome.save();

    const newBalance = 100; // logika obliczania nowego salda

    res.status(200).json({
      newBalance: newBalance,
      transaction: newIncome
    });
  } catch (error) {
    console.error('Error adding income:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Funkcja pobierania przychodów
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find();

    const monthStats = {
      "January": 5,
      "February": 100,
      "March": "N/A",
      "April": "N/A",
      "May": 1,
      "June": "N/A",
      "July": 3,
      "August": "N/A",
      "September": "N/A",
      "October": 77,
      "November": "N/A",
      "December": 123 // Na razie ustawione sztywne wartości 
    };

    res.status(200).json({
      incomes,
      monthStats
    });
  } catch (error) {
    // Obsługa błędów
    console.error('Error getting incomes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  addIncome,
  getIncomes
};