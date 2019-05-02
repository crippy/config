const express = require('express');
const router = express.Router();
const controller = require('./auth.controller');

// @route   GET api/auth
// @desc    Authenticate user
// @access  Public
router.get('/', controller.auth);

module.exports = router;
