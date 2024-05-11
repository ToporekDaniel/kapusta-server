const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 300
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
  }
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
