// Location bio etc
// Authentication username, password
const express = require('express');
const router = express.Router();
const controller = require('./posts.controller');
const auth = require('../../middleware/auth');
const { check } = require('express-validator/check');

// @route   GET api/posts/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ id: 1, name: 'Posts Works' });
});

// @route   GET api/posts
// @desc    posts
// @access  Private
router.get('/', auth, controller.getPosts);

// @route   GET api/posts/:id
// @desc    Posts by :id
// @access  Private
router.get('/:id', auth, controller.getPost);

// @route   DELETE api/posts/:id
// @desc    Delete by :id
// @access  Private
router.delete('/:id', auth, controller.deletePost);

// @route   POST api/posts/:id/like
// @desc    POST like / unline a post
// @access  Private
router.post('/:id/like', auth, controller.postLike);

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required.')
        .not()
        .isEmpty()
    ]
  ],
  controller.postData
);

module.exports = router;
