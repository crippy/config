const validate = require('validate.js');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
  let error = {};

  if (!validate.isLength(data.name, { min: 2, max: 50 })) {
    errors.name = 'Name must be between 2 and 50 characters';
  }

  if (!validate({ from: data.email })) {
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
