// Authentication username, password
const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('./users.controller');

// /api/item
// router
//   .route('/')
//   .get(controllers.getOne)
//   .post(controllers.createOne);

// @route   GET api/users/test
// @desc    Test user route
// @access  Public
router.get('/test', controller.getTest);

// @route   POST api/users/register
// @desc    Register
// @access  Public
router.post('/register', controller.register);

// @route   POST api/users/login
// @desc    Login
// @access  Public
router.post('/login', controller.login);

// @route   GET api/users/current
// @desc    Get current user
// @access  Private Protected Route
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  controller.currentUser
);

module.exports = router;
