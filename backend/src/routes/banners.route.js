const { Router } = require('express');
const { isAdmin } = require('../middlewares/is-admin.middleware');
const { createBanner, showBanners, updateBanner, removeBanner } = require('../controllers/banners.controller');
const router = Router()

router.post('/banners', isAdmin, createBanner);
router.get('/banners', showBanners);
router.put('/banners/:id', isAdmin, updateBanner);
router.delete('/banners/:id', isAdmin, removeBanner);

module.exports = router;