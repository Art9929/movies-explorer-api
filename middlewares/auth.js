const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const {
  UnauthorizedError, // 401
} = require('../errors/index');

// Верификация Токена
function auth(req, res, next) {
  let token = req.headers.cookie;
  let payload = '';

  if (!token) {
    return next(new UnauthorizedError('Нет токена'));
  }
  try {
    token = token.split('=');
    payload = jwt.verify(token[1], JWT_SECRET);
  } catch {
    return next(new UnauthorizedError('Ошибка токена (не верный токен)'));
  }
  req.user = payload;
  return next();
}

module.exports = auth;
