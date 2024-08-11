const { Router } = require('express');
const { isAdmin } = require('../middlewares/is-admin.middleware');
const { createPlace, showPlace, updatePlace, removePlace } = require('../controllers/places.controller');
const router = Router()

router.post('/places', isAdmin, createPlace);
router.get('/places', showPlace);
router.put('/places/:id', isAdmin, updatePlace);
router.delete('/places/:id', isAdmin, removePlace);

module.exports = router;