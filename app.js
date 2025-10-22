const express = require('express');

const app = express();

app.use(express.json());

app.use('/api', require('./routes/api/root'));
app.use('/api/topics', require('./routes/api/topics'));

module.exports = app;
