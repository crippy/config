// Location bio etc
// Authentication username, password
const express = require('express');
const router = express.Router();

// @route   GET api/profile/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ id: 1, name: 'Profile Works' });
});

module.exports = router;
