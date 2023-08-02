const {
  ForbiddenError, // 403
  NotFound, // 404
  BadRequest, // 400

  // MODUL http2
  ok, // 200
  created, // 201
} = require('../errors/index');
const Movie = require('../models/movie');

// all Movies
const getMovies = (req, res, next) => Movie.find({ owner: req.user.id })
  .then((movies) => res.json({ movies }))
  .catch(next);

// create Movie
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body; // данные, которые отправляем
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user.id,
  })
    .then((newMovie) => { res.status(created).send(newMovie); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные!'));
      }
      return next(err);
    });
};

// delete Movie
const deleteMovieById = (req, res, next) => {
  const { _id } = req.params;

  return Movie.findById(_id)
    .then((movie) => {
      if (!movie) throw new NotFound('Несуществующий id карточки!');
      if (movie.owner.toString() !== req.user.id) throw next(new ForbiddenError('Нет прав на удаление'));
      // Удаление
      return Movie.findByIdAndRemove(_id);
    })
    .then(() => {
      res.status(ok).send({ message: 'Карточка удалилась!' });
    })
    .catch((err) => {
      if (err === 'CastError') {
        return next(new BadRequest('Некорректный id карточки!'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
