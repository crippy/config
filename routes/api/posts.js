// Location bio etc
// Authentication username, password
const express = require('express');
const router = express.Router();

// @route   GET api/posts/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ id: 1, name: 'Posts Works' });
});

module.exports = router;
