const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { transcribe } = require('../controllers/transcribeController');

router.post('/transcribe', auth, transcribe);

module.exports = router;
    