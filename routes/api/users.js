// Authentication username, password
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../../models/User');
const keys = require('../../config/keys');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route   GET api/users/test
// @desc    Test user route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ id: 1, name: 'Jacker Reacher' });
});

// @route   POST api/users/register
// @desc    Register
// @access  Public
router.post('/register', (req, res) => {
  // validate the req.body require the validationLib
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    res.status(400).json(errors);
  }
  // first find if email exists using mongoose model fn's
  const email = req.body.email;

  User.findOne({ email })
    .then(user => {
      if (user)
        return res.status(400).json({ message: 'Email already exists' });

      // gets a random avatar
      const avatar = gravatar.url(email, { s: '200' });
      const newUser = new User({
        name: req.body.name,
        email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    })
    .catch(error => {
      console.log(error);
    });
});

// @route   POST api/users/login
// @desc    Login
// @access  Public
router.post('/login', (req, res) => {
  // validate the data passed in
  const { errors, isValid } = validateLoginInput(req.body);
  // return the errors if validation fails
  if (!isValid) {
    res.status(400).json(errors);
  }
  const { email, password } = req.body;
  // Find user by email
  User.findOne({ email })
    .then(user => {
      // check for a user
      if (!user) return res.status(404).json({ message: 'Incorrect email' });

      // Check Password
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // user matched in our db
            // Create jwt payload
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };

            // JWT token build, sign token with payload and secret, expiresIn 1hr
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({ token: `Bearer ${token}` });
              }
            );
          } else {
            error.password = 'Password incorrect';
            return res.status(400).json(errors);
          }
        })
        .catch(err => retrun.status(404).json({ message: err }));
    })
    .catch(err => retrun.status(500).json({ message: err }));
});

// @route   GET api/users/current
// @desc    Get current user
// @access  Private Protected Route
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = req.user;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  }
);

module.exports = router;
