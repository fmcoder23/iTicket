const { Router } = require('express');
const router = Router();
const { isAdmin } = require('../middlewares/is-admin.middleware');
const { createEvent, showEvents, showEventById, updateEvent, removeEvent, addToCart, addToFavorite } = require('../controllers/events.controller');
const { isAuth } = require('../middlewares/is-auth.middleware');

router.post('/events', isAdmin, createEvent);
router.get('/events', showEvents);
router.get('/events/:id', isAuth, showEventById);
router.put('/events/:id', isAdmin, updateEvent);
router.delete('/events/:id', isAdmin, removeEvent);
router.post('/events/:eventId/add-to-cart', isAuth, addToCart);
router.post('/events/:eventId/add-to-favorite', isAuth, addToFavorite);

module.exports = router;