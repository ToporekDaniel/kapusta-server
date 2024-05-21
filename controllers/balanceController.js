const User = require('../models/user'); // Używamy poprawnej nazwy zmiennej

// Middleware dla aktualizacji balansu użytkownika
const updateBalance = async (req, res, next) => {
  try {
    const user = req.user; 
    const { amount } = req.body;

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (typeof amount !== "number") {
      return res.status(400).json({ message: "Invalid amount" });
    }

    user.balance += amount;
    await user.save();

    req.balance = user.balance; 
    next();
  } catch (error) {
    console.error("Error updating balance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Odczyt bilansu
const getBalance = async (req, res) => {
  try {
    const owner = req.user._id;
    const balance = await Balance.findOne({ owner });

    if (!balance) {
      return res.status(404).json({ message: 'Balance not found' });
    }

    res.status(200).json({ balance });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  updateBalance,
  getBalance
};
