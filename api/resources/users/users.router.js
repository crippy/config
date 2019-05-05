// Authentication username, password
const express = require('express');
const router = express.Router();
const controller = require('./users.controller');
const { check } = require('express-validator/check');

// @route   GET api/users/test
// @desc    Test user route
// @access  Public
router.get('/test', controller.getTest);

// @route   POST api/users/register
// @desc    Register
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  controller.register
);

// @route   GET api/users/current
// @desc    Get current user
// @access  Private Protected Route
router.get('/current', controller.currentUser);

module.exports = router;
