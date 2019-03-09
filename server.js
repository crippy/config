const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const bodyParser = require('body-parser');

//routes import
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

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

app.get('/', (req, res) => {
  res.send('Hello');
});

// User Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
