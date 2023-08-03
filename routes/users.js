const router = require('express').Router();
const {
  getUser,
  updateProfileUser,
} = require('../controllers/users');

const celebrates = require('../middlewares/celebrates');

router.get('/me', getUser);
router.patch('/me', celebrates.updateUser, updateProfileUser);

module.exports = router;
