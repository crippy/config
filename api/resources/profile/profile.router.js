// Location bio etc
// Authentication username, password
const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('./profile.controller');

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
  controller.getProfile
);

// @route   GET api/profile/handle/:handle
// @desc    GET Profile by handle
// @access  Public
router.get('/handle/:handle', controller.getHandleById);

// @route   GET api/profile/user/:user_id
// @desc    GET Profile by user_id
// @access  Public
router.get('/user/:user_id', controller.getProfileById);

// @route   GET api/profile/all
// @desc    GET All Profiles
// @access  Public
router.get('/all', controller.getAllProfiles);

// @route   POST api/profile/experience
// @desc    POST Profile experience
// @access  Private JWT
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  controller.postProfileExperience
);

// @route   DELETE api/profile/experience/:id
// @desc    DELETE Profile experience by id
// @access  Private JWT
router.delete(
  '/experience/:id',
  passport.authenticate('jwt', { session: false }),
  controller.deleteProfileExperience
);

// @route   POST api/profile/education
// @desc    POST Profile education
// @access  Private JWT
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  controller.postProfileExperience
);

// @route   DELETE api/profile/education/:id
// @desc    DELETE Profile education by id
// @access  Private JWT
router.delete(
  '/education/:id',
  passport.authenticate('jwt', { session: false }),
  controller.deleteProfileExpById
);

// @route   POST api/profile
// @desc    POST Profile for user
// @access  Private JWT
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  controller.postProfile
);

// @route   DELETE api/profile
// @desc    DELETE Profile
// @access  Private JWT
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  controller.deleteProfile
);

module.exports = router;
