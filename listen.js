const app = require('./app');
const { PORT } = require('./config/keys');

app.listen(PORT || 6543, () => {
  console.log(`👂 Listening on port ${PORT || 6543}`);
});
