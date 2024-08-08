const { Router } = require('express');
const { isAuth } = require('../middlewares/is-auth.middleware');
const { isAdmin } = require('../middlewares/is-admin.middleware');
const { createContact, getContacts } = require('../controllers/contacts.controller');
const router = Router()

router.post('/contacts', isAuth, createContact);
router.get('/contacts', isAdmin, getContacts);

module.exports = router;