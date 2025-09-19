const Message = require('../models/Message');
const User = require('../models/User');

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newMessage = await Message.create({
      senderId: req.user._id,
      receiverId,
      message,
      file: req.file ? req.file.path : null
    });

    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).json({ message: 'Failed to send message' });
  }
};

const getUserMessages = async (req, res) => {
  try {
    const messages = await Message.find({ receiverId: req.user._id })
      .populate('senderId', 'username')
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch messages' });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('senderId', 'username')
      .populate('receiverId', 'username')
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch messages' });
  }
};

module.exports = { sendMessage, getUserMessages, getAllMessages };