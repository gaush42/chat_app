const Message = require('../model/message_model');

exports.sendMessage = async (req, res) => {
    try {
        const { message, userId } = req.body;
        if(!message || !userId){
            return res.status(400).json({ message: 'Message and userId are required'})
        }
        const newMessage = await Message.create({ message, userId });
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}