const Joi = require('@hapi/joi');

// Definicja walidatora dla danych użytkownika
const userValidateSchema = Joi.object ({
    email: Joi.string().email().required(),
    password: joiPassword
        .string()
        .min(8)
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .doesNotInclude(["password"])
        .required(),
})

module.exports = userValidateSchema;