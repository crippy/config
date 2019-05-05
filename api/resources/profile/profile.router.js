// Location bio etc
// Authentication username, password
const express = require('express');
const router = express.Router();
const controller = require('./profile.controller');
const auth = require('../../middleware/auth');
const { check } = require('express-validator/check');

// @route   GET api/profile/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ id: 1, name: 'Profile Works' });
});

// @route   GET api/profile
// @desc    GET current users profle: loggedin user
// @access  Private
router.get('/', auth, controller.getProfile);

// @route   GET api/profile/handle/:handle
// @desc    GET Profile by handle
// @access  Public
router.get('/handle/:handle', controller.getHandleById);

// @route   GET api/profile/user/:user_id
// @desc    GET Profile by user_id
// @access  Private
router.get('/user/:user_id', controller.getProfileById);

// @route   GET api/profile/all
// @desc    GET All Profiles
// @access  Public
router.get('/all', controller.getAllProfiles);

// @route   POST api/profile/experience
// @desc    POST Profile experience
// @access  Private JWT
router.post('/experience', controller.postProfileExperience);

// @route   DELETE api/profile/experience/:id
// @desc    DELETE Profile experience by id
// @access  Private JWT
router.delete('/experience/:id', controller.deleteProfileExperience);

// @route   POST api/profile/education
// @desc    POST Profile education
// @access  Private JWT
router.post('/education', controller.postProfileExperience);

// @route   DELETE api/profile/education/:id
// @desc    DELETE Profile education by id
// @access  Private JWT
router.delete('/education/:id', controller.deleteProfileExpById);

// @route   POST api/profile
// @desc    POST Profile for user
// @access  Private
router.post(
  '/',
  auth,
  [
    check('status', 'Status is required')
      .not()
      .isEmpty(),
    check('skills', 'Skills is required')
      .not()
      .isEmpty()
  ],
  controller.postProfile
);

// @route   DELETE api/profile
// @desc    DELETE Profile
// @access  Private JWT
router.delete('/', controller.deleteProfile);

module.exports = router;
