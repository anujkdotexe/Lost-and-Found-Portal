const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/:userId', protect, getMessages);
router.post('/', protect, sendMessage);

module.exports = router;
