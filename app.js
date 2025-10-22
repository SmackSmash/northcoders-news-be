const express = require('express');

const app = express();

app.use(express.json());

app.use('/api', require('./routes/api/root'));
app.use('/api/topics', require('./routes/api/topics'));
app.use('/api/articles', require('./routes/api/articles'));
app.use('/api/users', require('./routes/api/users'));

module.exports = app;
