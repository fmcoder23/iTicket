const { Router } = require('express');
const { register, verify, login, adminLogin } = require('../controllers/auth.controller');
const router = Router()

router.post('/auth/register', register);
router.post('/auth/verify', verify);
router.post('/auth/login', login);
router.post('/admin/login', adminLogin)

module.exports = router;