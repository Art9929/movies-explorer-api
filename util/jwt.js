const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

// Создаем Токен
const generateToken = (id) => jwt.sign({ id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

module.exports = {
  generateToken,
};
