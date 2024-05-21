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
      
      const owner = req.user._id;

    // Tworzenie nowego przychodu z dodanym miesiącem
      const newIncome = new Income({
      owner,
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
    const owner = req.user._id;

    const incomes = await Income.find({ owner });

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

    // Obliczanie sumy dla każdego miesiąca
    incomes.forEach(income => {
      const month = new Date(income.date).toLocaleString('default', { month: 'long' });
      monthStats[month] += income.amount;
    });

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

    const owner = req.user._id;

    const deletedIncome = await Income.findOneAndDelete({ _id: id, owner });

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
// const updateIncome = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ message: 'Invalid ID' });
//     }

//     const userId = req.user._id;

//     const updatedIncome = await Income.findOneAndUpdate({ _id: id, userId: userId }, { ...req.body }, { new: true });

//     if (!updatedIncome) {
//       return res.status(404).json({ message: 'Income not found' });
//     }

//     res.status(200).json(updatedIncome);
//   } catch (error) {
//     console.error('Error updating income:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


module.exports = {
  addIncome,
  getIncomes,
  deleteIncome,
};