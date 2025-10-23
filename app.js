const express = require('express');
const { notFoundHandler, errorHandler } = require('./controllers/errors');

const app = express();

app.use(express.json());

app.use('/api', require('./routes/api/root'));
app.use('/api/topics', require('./routes/api/topics'));
app.use('/api/articles', require('./routes/api/articles'));
app.use('/api/users', require('./routes/api/users'));

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
