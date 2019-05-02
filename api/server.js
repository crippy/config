const express = require('express');
const connectDB = require('./config/db.js');

//routes import
const auth = require('./resources/auth/auth.router');
const users = require('./resources/users/users.router');
const profile = require('./resources/profile/profile.router');
const posts = require('./resources/posts/posts.router');

// New express app
const app = express();

// Connect to db
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// PORT looks for environment variable
const port = process.env.PORT || 5000;

// @desc App Routes Register
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
