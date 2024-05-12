const Income = require('../models/Income');

// Funkcja dodawania przychodów
const addIncome = async (req, res) => {
  try {
    const { description, amount, date, month } = req.body; 

    
    const incomeMonth = new Date(date).getMonth();

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[incomeMonth];

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
    res.status(400).json({ message: 'Bad request' });
  }
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
  addIncome,
  getIncomes
};