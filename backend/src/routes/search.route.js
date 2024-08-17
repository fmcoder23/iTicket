const {Router} = require('express');
const { searchEvents } = require('../controllers/search.controller');
const router = Router();

router.get('/search', searchEvents);

module.exports = router;