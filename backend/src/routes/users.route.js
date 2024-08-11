const { Router } = require('express');
const { isAdmin } = require('../middlewares/is-admin.middleware');
const { showUser, createUser, updateUser, removeUser, showUserById } = require('../controllers/users.controller');
const { isAuth } = require('../middlewares/is-auth.middleware');
const router = Router();

router.get('/users', isAdmin, showUser)
router.get('/users/:id', isAuth, showUserById)
router.post('/users', isAdmin, createUser)
router.put('/users/:id', isAdmin, updateUser)
router.delete('/users/:id', isAdmin, removeUser)

module.exports = router;