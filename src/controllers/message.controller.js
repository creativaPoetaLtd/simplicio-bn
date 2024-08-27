import User from "../database/models/user.js";
import ChatMessage from "../database/models/message.js";


export const sendMessage = async (req, res) => {
    try {
        const senderEmail = req.user.email;
        console.log("Sender email", senderEmail);

        const { receiverEmail, message } = req.body;
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
        console.log("Error:", error);
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


export const getConversationUsers = async (req, res) => {
    try {
        const userEmail = req.user.email;

        // Find all unique users who have sent or received messages with the current user
        const conversationUsers = await ChatMessage.aggregate([
            {
                $match: {
                    $or: [
                        { senderEmail: userEmail },
                        { receiverEmail: userEmail }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderEmail", userEmail] },
                            "$receiverEmail",
                            "$senderEmail"
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "users", // Ensure this is the correct collection name for users
                    localField: "_id",
                    foreignField: "email",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: 0,
                    email: "$user.email",
                    name: "$user.name" // Adjust fields according to your user schema
                }
            }
        ]);

        res.status(200).json(conversationUsers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get conversation users' });
    }
}