const express = require('express');
const { notFoundHandler, dbErrorHandler, appErrorHandler } = require('./controllers/errors');

const app = express();

app.use(express.json());

app.use('/api', express.static('public'));
app.use('/api/topics', require('./routes/api/topics'));
app.use('/api/articles', require('./routes/api/articles'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/comments', require('./routes/api/comments'));

app.use(notFoundHandler);
app.use(dbErrorHandler);
app.use(appErrorHandler);

module.exports = app;
