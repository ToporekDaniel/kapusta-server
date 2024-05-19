const Balance = require('../models/Balance');

// Aktualizacja bilansu
const updateBalance = async (req, res) => {
  try {
    const { value } = req.body;
    const owner = req.user._id;

    let balance = await Balance.findOne({ owner });

    if (!balance) {
      balance = new Balance({ owner, value });
    } else {
      balance.value = value;
    }

    await balance.save();

    res.status(200).json({ message: 'Balance updated successfully', balance });
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
