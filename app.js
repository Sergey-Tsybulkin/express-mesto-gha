const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/router');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use(routes);

app.use((req, res, next) => {
  req.user = {
    _id: '64b0257a914036e955d82c86',
  };

  next();
});

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('DB connected');
  })
  .catch(() => {
    console.log('Cannot connect to the DB');
  });

app.get('/', (req, res) => {
  res.send('Testing');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});