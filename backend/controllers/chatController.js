const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params; // The ID of the other user in the chat

        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: userId },
                { sender: userId, receiver: req.user._id }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content, itemId } = req.body;

        const message = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            item: itemId || null,
            content
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
