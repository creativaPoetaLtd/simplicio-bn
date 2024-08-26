import User from "../database/models/user.js";
import ChatMessage from "../database/models/message.js";


export const sendMessage = async (req, res) => {
    try {
        const { receiverEmail, message } = req.body;
        const senderEmail = req.user.email;
        const receiver = await User.findOne({
            email: receiverEmail
        })
        if (!receiver) {
            return res.status(404).json({
                error: 'Receiver not found'
            })
        }
        const chatMessage = new ChatMessage({
            senderEmail,
            receiverEmail,
            message
        });
        await chatMessage.save();
        res.status(201).json({ message: 'Message Sent Successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' })
    }
}

export const getMessage = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const { contactEmail } = req.query;
        const message = await ChatMessage.find({
            $or: [
                {
                    senderEmail: userEmail, receiverEmail: contactEmail
                },
                {
                    senderEmail: contactEmail, receiverEmail: userEmail
                }
            ]
        }).sort({ timestamp: 1 })

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to receive messages' })
    }
}