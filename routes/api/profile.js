// Location bio etc
// Authentication username, password
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

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
    const user = req.user.id;
    Profile.findOne({ user })
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

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    // get all fields
    const profile = {
      ...req.body,
      user: req.user.id
    };
    if (typeof req.body.skills !== undefined) {
      profile.skills = req.body.skills.split(',');
    }
    // might need to fix social links check in console.log to see what way the
    //values are set

    // find if a profile exists or not determines if we create or update profile
  }
);

module.exports = router;
