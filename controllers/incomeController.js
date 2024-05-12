const Income = require('../models/Income');
const incomeSchema = require('../models/incomeJoi');


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

// Funkcja usuwania przychodu
const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const deletedIncome = await Income.findByIdAndDelete(id);

    if (!deletedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }

    // Symulacja aktualizacji salda
    const newBalance = 0;

    res.status(200).json({ newBalance });
  } catch (error) {
    // Obsługa błędów
    console.error('Error deleting income:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Funkcja aktualizacji przychodu
const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const { description, amount, date } = req.body;

    const updatedIncome = await Income.findByIdAndUpdate(id, { description, amount, date }, { new: true });

    if (!updatedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json(updatedIncome);
  } catch (error) {
    // Obsługa błędów
    console.error('Error updating income:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  addIncome,
  getIncomes,
  deleteIncome,
  updateIncome
};