const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const app = express();

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

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
