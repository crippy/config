// Authentication username, password
const express = require('express');
const router = express.Router();

// @route   GET api/users/test
// @desc    Test user route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ id: 1, name: 'Jacker Reacher' });
});

module.exports = router;
