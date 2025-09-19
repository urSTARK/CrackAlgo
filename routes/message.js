const express = require('express');
const multer = require('multer');
const { auth, adminAuth } = require('../middleware/auth');
const { sendMessage, getUserMessages, getAllMessages } = require('../controllers/messageController');
const Message = require('../models/Message');

const router = express.Router();

const upload = multer({ dest: 'uploads/messages/' });

router.post('/send', adminAuth, upload.single('file'), sendMessage);
router.get('/user', auth, getUserMessages);
router.get('/all', adminAuth, getAllMessages);

// Get conversation history between admin and specific user
router.get('/conversation/:userId', adminAuth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.userId, receiverId: req.user._id },
        { senderId: req.user._id, receiverId: req.params.userId }
      ]
    })
    .populate('senderId receiverId', 'username')
    .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch conversation' });
  }
});

module.exports = router;