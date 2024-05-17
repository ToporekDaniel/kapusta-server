const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
    max: 1000000000
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;