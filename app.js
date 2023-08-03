require('dotenv').config();

// const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate'); // для обработки ошибок
const {
  PORT,
  SERVER_MONGO,
  NODE_ENV,
  MONGODB,
} = require('./util/config');
const limiter = require('./util/limiter');
const routes = require('./routes/index');
const centrError = require('./middlewares/centrError'); // централизация ошибок
const { requestLogger, errorLogger } = require('./middlewares/logger');

const mongodb = NODE_ENV === 'production' ? SERVER_MONGO : MONGODB;

mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

const app = express();

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(cors({
  origin: [
    'https://a-ryabcev-films.nomoreparties.co/users/me',
    'http://a-ryabcev-films.nomoreparties.co/users/me'],
  credentials: true,
}));
app.use(limiter);
app.use(helmet());
app.use(express.json());

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(centrError);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server start on port ${PORT}`);
});
