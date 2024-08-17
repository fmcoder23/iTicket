const { Router } = require('express');
const { isAuth } = require('../middlewares/is-auth.middleware');
const { showFavorites, removeFavorite } = require('../controllers/favorites.controller');
const router = Router()

router.get('/favorites', isAuth, showFavorites);
router.delete('/favorites/:id', isAuth, removeFavorite);

module.exports = router;