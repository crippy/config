const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');
const controller = require('./auth.controller');
const auth = require('../../middleware/auth');

// @route   GET api/auth
// @desc    Authenticate user return user info
// @access  Private
router.get('/', auth, controller.authGet);

// @route   POST api/auth
// @desc    Authenticate userreutrn token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password required').exists()
  ],
  controller.authCreate
);

module.exports = router;
