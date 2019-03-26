const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  if (!Validator.isLength(data.handle, { min: 2, max: 50 })) {
    errors.handle = 'Handle Needed between 2 and 50 characters';
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Handle field is required';
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = 'Status field is required';
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isUrl(data.website)) {
      errors.website = 'Not a valid Website URL';
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isUrl(data.twitter)) {
      errors.twitter = 'Not a valid Twitter URL';
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isUrl(data.facebook)) {
      errors.facebook = 'Not a valid facebook URL';
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isUrl(data.instragram)) {
      errors.instagram = 'Not a valid instragram URL';
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isUrl(data.youtube)) {
      errors.youtube = 'Not a valid instragram URL';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
