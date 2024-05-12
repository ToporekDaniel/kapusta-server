const Joi = require('@hapi/joi');

// Definicja walidatora dla danych wejściowych
const incomeSchema = Joi.object({
  description: Joi.string().min(1).max(300).required(),
  amount: Joi.number().min(1).max(1000000000).required(),
  date: Joi.date().iso().required()
});

module.exports = incomeSchema;
