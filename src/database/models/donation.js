import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    churchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Church",
        required: true,
    },
    churchName: {
        type: String,
        required: true
    },
    iban: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    charityAction: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    transactionId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    name: {
        type: String,
        default: 'Anonyme', // Default value set to 'anonymous'
    },
});

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
