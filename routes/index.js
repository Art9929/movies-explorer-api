const router = require('express').Router();
const {
  NotFound, // 404
} = require('../errors/index');
const auth = require('../middlewares/auth');

const {
  login,
  createUser,
  logOut,
  getUser,
  updateProfileUser,
} = require('../controllers/users');

const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

const celebrates = require('../middlewares/celebrates');

router.get('/', (req, res) => res.send({ message: 'Главная' }));
router.post('/signup', celebrates.createUser, createUser);
router.post('/signin', celebrates.loginUser, login);
router.get('/signout', logOut);

router.get('/users/me', auth, getUser);
router.patch('/users/me', auth, celebrates.updateUser, updateProfileUser);

router.get('/movies', auth, getMovies);
router.post('/movies', auth, celebrates.createMovie, createMovie);
router.delete('/movies/:_id', auth, celebrates.createMovie, deleteMovieById);

router.use('*', (req, res, next) => next(new NotFound('Такой страницы не существует!')));

module.exports = router;
