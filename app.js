require('dotenv').config();

// const cookieParser = require('cookie-parser');
const express = require('express');
// const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate'); // для обработки ошибок
const routes = require('./routes/index');
const centrError = require('./middlewares/centrError'); // централизация ошибок
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 4000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/ex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
}).then(() => {
  // eslint-disable-next-line no-console
  console.log('connected to db');
});

const app = express();

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// app.use(express.static(path.join(__dirname, '../frontend/build'))); // подключаем фронт

app.use(cors({
  origin: [
    'https://a-ryabcev.nomoredomains.xyz',
    'http://a-ryabcev.nomoredomains.xyz',
    'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json()); // то, что позволит обрабатывать json при методе post

app.use(requestLogger); // подключаем логгер запросов
app.use(routes); // Подключаем роуты
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработка ошибок celebrate
app.use(centrError); // централизованный обработчик ошибок

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server start on port ${PORT}`);
});
