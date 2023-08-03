const bcrypt = require('bcrypt');
const {
  ConflictError, // 409
  NotFound, // 404
  UnauthorizedError, // 401
  BadRequest, // 400
  ok, // 200
  created, // 201
} = require('../errors/index');

const {
  INCORRECT_DATA,
  INCORRECT_EMAIL_PASSWORD,
  INCORRECT_PASSWORD,
  CONFLICT_EMAIL,
  NOT_FOUND,
  COOKIE_CLEARED,
} = require('../util/constants');

const User = require('../models/user');
const { generateToken } = require('../util/jwt');

const SALT_ROUNDS = 10;

// Выход
const logOut = (req, res) => {
  res.status(ok).clearCookie('auth').send({ message: COOKIE_CLEARED });
};

// Авторизация
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(INCORRECT_EMAIL_PASSWORD);
      }
      return bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) {
          return next(new UnauthorizedError(INCORRECT_PASSWORD));
        }
        // Создать и отдать токен
        const token = generateToken(user._id);
        res.cookie('auth', token, {
          maxAge: 6048000,
          httpOnly: true,
          sameSite: true,
        });
        return res.status(ok).send({ token });
      });
    })
    .catch(next);
};

// Регистрация | create user
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    User.create({
      name, email, password: hash,
    })
      .then((user) => {
        const userWithoutPassword = user.toJSON();
        delete userWithoutPassword.password;
        res.status(created).send(userWithoutPassword);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequest(INCORRECT_DATA));
        }
        if (err.code === 11000) {
          return next(new ConflictError(CONFLICT_EMAIL));
        }
        return next(err);
      });
  });
};

// one user
const getUser = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        throw new NotFound(NOT_FOUND);
      }
      return res.status(ok).send(user);
    })
    .catch((err) => {
      if (err === 'CastError') {
        return next(new BadRequest(INCORRECT_DATA));
      }
      return next(err);
    });
};

// update profile
const updateProfileUser = (req, res, next) => {
  const { email, name } = req.body;

  return User.findByIdAndUpdate(
    req.user.id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((updateProfile) => {
      res.status(ok).send(updateProfile);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(INCORRECT_DATA));
      }
      if (err.code === 11000) {
        return next(new ConflictError(CONFLICT_EMAIL));
      }
      return next(err);
    });
};

module.exports = {
  getUser,
  createUser,
  updateProfileUser,
  login,
  logOut,
};
