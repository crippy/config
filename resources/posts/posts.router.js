// Location bio etc
// Authentication username, password
const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('./posts.controller');

// @route   GET api/posts/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ id: 1, name: 'Posts Works' });
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  controller.postData
);

module.exports = router;
