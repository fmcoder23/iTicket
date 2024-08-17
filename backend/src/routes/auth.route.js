const { Router } = require('express');
const { register, verify, login, adminLogin, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const router = Router()


router.post('/auth/register', register);
router.post('/auth/verify', verify);
router.post('/auth/login', login);
router.post('/admin/login', adminLogin)
router.post('/auth/forgot', forgotPassword)
router.post('/auth/reset', resetPassword)

module.exports = router;