// Authentication username, password
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Test user route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ id: 1, name: 'Jacker Reacher' });
});

// @route   GET api/users/register
// @desc    Register
// @access  Public
router.post('/register', (req, res) => {
  // first find if email exists using mongoose model fn's
  const email = req.body.email;

  User.findOne({ email })
    .then(user => {
      if (user)
        return res.status(400).json({ message: 'Email already exists' });

      // gets a random avatar
      const avatar = gravatar.url(email, { s: '200', d: mm });
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

module.exports = router;
