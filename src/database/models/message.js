import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    senderEmail: {
        type: String,
        required: true,
    },
    receiverEmail: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false,
    }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;