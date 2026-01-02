const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { generateScript  } = require('../controllers/youtubeScriptController');

router.post('/youtube/script', auth, generateScript );

module.exports = router;
    