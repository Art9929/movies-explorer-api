const router = require('express').Router();
const { NotFound } = require('../errors/index');
const userRoutes = require('./users');
const moviesRoutes = require('./movies');

const auth = require('../middlewares/auth');
const celebrates = require('../middlewares/celebrates');

const {
  login,
  createUser,
  logOut,
} = require('../controllers/users');

const {
  NOT_FOUND_PAGE,
} = require('../util/constants');

router.use('/users', auth, userRoutes);
router.use('/movies', auth, moviesRoutes);
router.post('/signup', celebrates.createUser, createUser);
router.post('/signin', celebrates.loginUser, login);
router.get('/signout', auth, logOut);
router.use('*', auth, (req, res, next) => next(new NotFound(NOT_FOUND_PAGE)));

module.exports = router;
