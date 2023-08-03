const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const {
  UnauthorizedError, // 401
} = require('../errors/index');
const {
  INCORRECT_TOCKEN,
  NOT_TOCKEN,
} = require('../util/constants');

// Верификация Токена
function auth(req, res, next) {
  let token = req.headers.cookie;
  let payload = '';

  if (!token) {
    return next(new UnauthorizedError(NOT_TOCKEN));
  }
  try {
    token = token.split('=');
    payload = jwt.verify(token[1], NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch {
    return next(new UnauthorizedError(INCORRECT_TOCKEN));
  }
  req.user = payload;
  return next();
}

module.exports = auth;
