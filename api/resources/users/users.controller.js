const gravatar = require('gravatar');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./users.model');
const validateLoginInput = require('../../validation/login');
const config = require('config');

module.exports = {
  register: async (req, res) => {
    // error handling from req.body
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;
      // See if user exists...
      let user = await User.findOne({ email });
      // if user
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'User already exists' }] });
      }
      // get user gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        rating: 'pg',
        d: 'mm'
      });

      // create new user instance
      user = new User(name, email, avatar, password);
      // salt the password
      const salt = await bcrypt.genSalt(10);
      // take password and hash
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // create payload
      const payload = {
        user: {
          id: user.id
        }
      };

      // JWT Sign
      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).json('Server Error');
    }

    // Return jsonWebToken

    console.log(req.body);
    res.json(req.body);

    // validate the req.body require the validationLib
    // const { errors, isValid } = validateRegisterInput(req.body);
    // if (!isValid) {
    //   res.status(400).json(errors);
    // }
    // // first find if email exists using mongoose model fn's

    //     // Encrypt Password
    //     bcrypt.genSalt(10, (err, salt) => {
    //       bcrypt.hash(newUser.password, salt, (err, hash) => {
    //         if (err) throw err;
    //         newUser.password = hash;
    //         newUser
    //           .save()
    //           .then(user => res.json(user))
    //           .catch(err => console.log(err));
    //       });
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  },
  login: (req, res) => {
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
        if (!user) res.status(404).json({ message: 'Incorrect email' });
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
          .catch(err => res.status(404).json({ message: err }));
      })
      .catch(err => res.status(500).json({ message: err }));
  },
  currentUser: (req, res) => {
    const user = req.user;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  },
  getTest: (req, res) => {
    res.json({ id: 1, name: 'Jacker Reacher' });
  }
};
