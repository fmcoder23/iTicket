const { Router } = require('express');
const { isAdmin } = require('../middlewares/is-admin.middleware');
const { createCategory, showCategory, showCategoryById, updateCategory, removeCategory } = require('../controllers/categories.controller');
const router = Router()

router.post('/categories', isAdmin, createCategory);
router.get('/categories', showCategory);
router.get('/categories/:id', showCategoryById);
router.put('/categories/:id', isAdmin, updateCategory);
router.delete('/categories/:id', isAdmin, removeCategory);

module.exports = router;