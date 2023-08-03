const {
  ForbiddenError, // 403
  NotFound, // 404
  BadRequest, // 400
  ok, // 200
  created, // 201
} = require('../errors/index');

const {
  INCORRECT_DATA,
  NOT_FOUND_ID_FILM,
  NO_RIGHTS,
  DELETE_FILM,
  INCORRECT_ID_FILM,
} = require('../util/constants');

const Movie = require('../models/movie');

// all Movies
const getMovies = (req, res, next) => Movie.find({ owner: req.user.id })
  .then((movies) => res.status(ok).json({ movies }))
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
        return next(new BadRequest(INCORRECT_DATA));
      }
      return next(err);
    });
};

// delete Movie
const deleteMovieById = (req, res, next) => {
  const { _id } = req.params;

  return Movie.findById(_id)
    .then((movie) => {
      if (!movie) throw new NotFound(NOT_FOUND_ID_FILM);
      if (movie.owner.toString() !== req.user.id) throw next(new ForbiddenError(NO_RIGHTS));
      // Удаление
      return Movie.findByIdAndRemove(_id);
    })
    .then(() => {
      res.status(ok).send({ message: DELETE_FILM });
    })
    .catch((err) => {
      if (err === 'CastError') {
        return next(new BadRequest(INCORRECT_ID_FILM));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
