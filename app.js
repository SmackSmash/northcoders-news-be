const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello there!');
});

app.use('/api/topics', require('./routes/api/topics'));

module.exports = app;
