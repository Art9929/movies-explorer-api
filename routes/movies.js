const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

const celebrates = require('../middlewares/celebrates');

router.get('/', getMovies);
router.post('/', celebrates.createMovie, createMovie);
router.delete('/:_id', celebrates.getMovieId, deleteMovieById);

module.exports = router;
