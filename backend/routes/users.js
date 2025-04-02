const express = require('express');
const auth = require('../middleware/auth');
const { getEngineers } = require('../controllers/users');
const router = express.Router();

router.get('/engineers', auth, getEngineers);

module.exports = router;
