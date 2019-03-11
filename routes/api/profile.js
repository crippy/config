// Location bio etc
// Authentication username, password
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const profileModel = require('../../models/Profile');
const userModel = require('../../models/User');

// @route   GET api/profile/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ id: 1, name: 'Profile Works' });
});

// @route   GET api/profile
// @desc    GET current users profle: loggedin user
// @access  Private with passport.authenticate
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    profileModel
      .findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noProfile = 'Profile does not exist';
          return res.status(404).json(errors);
        }
        return res.json(profile);
      })
      .catch(error => {
        return res.status(404).json(error);
      });
  }
);

module.exports = router;
