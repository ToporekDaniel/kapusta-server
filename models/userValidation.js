// const Joi = require('@hapi/joi');

// // Definicja walidatora dla danych użytkownika
// const userValidateSchema = Joi.object ({
//     email: Joi.string().email().required(),
//     password: joiPassword
//         .string()
//         .min(8)
//         .minOfSpecialCharacters(1)
//         .minOfLowercase(1)
//         .minOfUppercase(1)
//         .minOfNumeric(1)
//         .noWhiteSpaces()
//         .onlyLatinCharacters()
//         .doesNotInclude(["password"])
//         .required(),
// })

// module.exports = userValidateSchema;

const Joi = require("@hapi/joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

// Definicja walidatora dla danych użytkownika
const passwordSchema = joiPassword
  .string()
  .min(8)
  .max(30)
  .minOfLowercase(1)
  .minOfUppercase(1)
  .minOfNumeric(1)
  .minOfSpecialCharacters(1)
  .noWhiteSpaces()
  .messages({
    "password.minOfUppercase":
      "{#label} should contain at least {#min} uppercase character",
    "password.minOfSpecialCharacters":
      "{#label} should contain at least {#min} special character",
    "password.minOfLowercase":
      "{#label} should contain at least {#min} lowercase character",
    "password.minOfNumeric":
      "{#label} should contain at least {#min} numeric character",
    "password.noWhiteSpaces": "{#label} should not contain white spaces",
  });

// Niestandardowy walidator dla sprawdzenia niedozwolonych słów
const doesNotInclude = (forbiddenWords) => {
  return (value, helpers) => {
    for (let word of forbiddenWords) {
      if (value.toLowerCase().includes(word.toLowerCase())) {
        return helpers.message(`Password must not include the word "${word}"`);
      }
    }
    return value;
  };
};

const userValidateSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordSchema.custom(doesNotInclude(["password"])).required(),
});

module.exports = userValidateSchema;
