const Balance = require('../models/Balance');

// Aktualizacja bilansu
const updateBalance = async (req, res, next) => {
  try {
    const { amount } = req.body; 
    const owner = req.user._id; 

    if (typeof amount !== 'number') {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    let balance = await Balance.findOne({ owner });

    if (!balance) {
      //Jeśli balance nie istnieje, stwówz nowy balance
      balance = new Balance({ owner, value: amount });
    } else {
      // Aktualizja istniejącego balance
      balance.value += amount;
    }

    await balance.save(); 

    req.balance = balance; 
    next(); 
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ message: 'Internal server error' });
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
