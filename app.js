const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const routes = require('./routes/router');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64b0257a914036e955d82c86',
  };

  next();
});

app.use(routes);

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('DB connected');
  })
  .catch(() => {
    console.log('Cannot connect to the DB');
  });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
