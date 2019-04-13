const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.instituation = !isEmpty(data.instituation) ? data.instituation : '';
  data.course = !isEmpty(data.course) ? data.course : '';
  data.classification = !isEmpty(data.classification)
    ? data.classification
    : '';
  data.datefrom = !isEmpty(data.datefrom) ? data.datefrom : '';
  data.dateTo = !isEmpty(data.dateTo) ? data.dateTo : '';

  if (Validator.isEmpty(data.instituation)) {
    errors.instituation = 'Instituation field is required';
  }

  if (Validator.isEmpty(data.course)) {
    errors.course = 'Course field is required';
  }

  if (Validator.isEmpty(data.classification)) {
    errors.classification = 'Classification field is required';
  }

  if (Validator.isEmpty(data.datefrom)) {
    errors.dateFrom = 'Date From field is required';
  }

  if (Validator.isEmpty(data.dateTo)) {
    errors.dateTo = 'Date To field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
