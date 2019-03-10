const validator = require('validate.js');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
  let error = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : '';

  if (!validator.isLength(data.name, { min: 2, max: 50 })) {
    errors.name = 'Name must be between 2 and 50 characters';
  }

  if (validator.isEmpty(data.name)) {
    errors.name = 'Name must not be empty';
  }

  if (validator.isEmpty(data.email)) {
    errors.name = 'Email is required';
  }

  if (validator.email(data.email)) {
    errors.name = 'Not a valid email address';
  }

  if (validator.isEmpty(data.password)) {
    errors.name = 'Password is required';
  }

  if (validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.name = 'Password must be a minimum of 6 characters';
  }

  if (validator.isEmpty(data.confirmPassword)) {
    errors.name = 'Confirm Password is required';
  }

  if (validator.equals(data.password, data.confirmPassword)) {
    errors.name = 'Passwords do not match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
