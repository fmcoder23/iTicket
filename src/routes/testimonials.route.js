const { Router } = require('express');
const { isAuth } = require('../middlewares/is-auth.middleware');
const { createTestimonial, showTestimonials, updateTestimonial, removeTestimonial } = require('../controllers/testimonials.controller');
const router = Router()

router.post('/testimonials', isAuth, createTestimonial);
router.get('/testimonials', showTestimonials);
router.put('/testimonials/:id', isAuth, updateTestimonial);
router.delete('/testimonials/:id', isAuth, removeTestimonial);

module.exports = router;