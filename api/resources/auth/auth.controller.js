const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../users/users.model');
const config = require('config');

module.exports = {
  authGet: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
  authCreate: async (req, res) => {
    // error handling from req.body
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exists...
      let user = await User.findOne({ email });

      // if not user
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid Credentails' }] });
      }

      // compare passwords 1 from typed in and the one from the db
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid Credentails' }] });
      }

      // create payload
      const payload = {
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        }
      };

      // JWT Sign
      jwt.sign(
        payload,
        config.get('jwtSecret'),
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
  }
};
