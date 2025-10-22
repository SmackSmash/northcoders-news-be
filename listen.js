const app = require('./app');
const { PORT } = require('./config/keys');

app.listen(PORT, () => {
  console.log(`👂 Listening on port ${PORT}`);
});
