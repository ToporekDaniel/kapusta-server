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

// Middleware dla odczytu bilansu użytkownika
const getBalance = async (req, res, next) => {
  try {
    const user = req.user; 

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const balance = user.balance; 

    req.balance = balance; 
    next();
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  updateBalance,
  getBalance
};
