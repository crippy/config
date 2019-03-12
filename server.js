const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const passport = require('passport');

//routes import
const users = require('./resources/users/users.router');
const profile = require('./resources/profile/profile.router');
const posts = require('./resources/posts/posts.router');

// Load Input Validation
const validateRegisterInput = require('./validation/register');

// New express app
const app = express();

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = keys.mongoURI;
// PORT
const port = process.env.PORT || 5000;
// connect db
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('Mongoo Connected');
  })
  .catch(err => {
    console.log(err);
  });

// Passport Middleware
app.use(passport.initialize());
// Passport Config
require('./config/passport')(passport);

// User Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
