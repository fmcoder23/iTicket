const { Router } = require('express');
const { isAuth } = require('../middlewares/is-auth.middleware');
const { getCart, updateCart, removeCart, buy } = require('../controllers/carts.controller');
const router = Router()

router.get('/carts', isAuth, getCart);
router.put('/carts/:id', isAuth, updateCart);
router.delete('/carts/:id', isAuth, removeCart);
router.post('/carts/buy', isAuth, buy)

module.exports = router;