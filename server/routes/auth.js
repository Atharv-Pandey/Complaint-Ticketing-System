const express = require('express');
const router = express.Router();
const { login, register, verifyToken } = require('../controllers/auth');

router.post('/login', login);
router.post('/register', register);
router.get('/verify', verifyToken);

module.exports = router;
