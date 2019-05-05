const gravatar = require('gravatar');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./users.model');
const config = require('config');

module.exports = {
  register: async (req, res) => {
    // error handling from req.body
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
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
      user = new User({ name, email, avatar, password });
      // salt the password
      const salt = await bcrypt.genSalt(10);
      // take password and hash
      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
