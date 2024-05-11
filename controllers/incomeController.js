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
