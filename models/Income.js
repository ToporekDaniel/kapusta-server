const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
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
  },
  month: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
