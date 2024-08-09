import Stripe from "stripe";
import mongoose from "mongoose";
import Church from "../database/models/church.js";
import Donation from "../database/models/donation.js";
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const donate = async (req, res) => {
    const { churchId, amount, charityAction, name } = req.body;

    // Validate input data
    if (!churchId || !amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid donation data" });
    }

    try {
        // Find the church by ID
        const church = await Church.findById(churchId);
        if (!church) {
            return res.status(404).json({ message: "Church not found" });
        }

        // Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['bancontact'], // Include both methods
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `Donation to ${church.name}`,
                    },
                    unit_amount: amount * 100, // Stripe expects the amount in cents
                },
                quantity: 1,
            }],
            metadata: {
                churchId: churchId,
                charityAction: charityAction,
            },
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/failed`
        });

        // Save the donation details to the database
        const donation = new Donation({
            churchId,
            churchName: church.name,
            iban: church.iban,
            amount,
            charityAction,
            transactionId: session.id,
            status: 'pending', // Set initial status to 'pending'
            name: name || 'Anonymous',
        });

        await donation.save();

        res.status(200).json({
            checkoutUrl: session.url,
            donationId: donation._id,
        });
    } catch (error) {
        console.error("Error processing donation:", error);
        res.status(500).json({ message: "Server error" });
    }
};



export const checkPaymentStatus = async (req, res) => {
    const { session_id } = req.query;
    try {

        const session = await stripe.checkout.sessions.retrieve(session_id);

        // Find the donation using the session ID
        const donation = await Donation.findOne({ transactionId: session.id });
        if (!donation) {
            return res.status(404).json({ message: "Donation not found" });
        }

        // Update the donation status based on the session payment status
        if (session.payment_status === 'paid' && donation.status !== 'completed') {
            donation.status = 'completed';
            await donation.save();
        }

        res.status(200).json({
            donationId: donation._id,
            status: donation.status,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Webhook to handle successful payment and create a transfer to the church's bank account
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400);
    }

    // Handle the payment_intent.succeeded event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        try {
            // Find the donation and church based on the payment intent ID
            const donation = await Donation.findOne({ transactionId: paymentIntent.id });
            if (!donation) {
                throw new Error('Donation not found');
            }

            const church = await Church.findById(donation.churchId);
            if (!church) {
                throw new Error('Church not found');
            }

            await stripe.transfers.create({
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                destination: church.iban,
                description: `Donation to ${church.name} for ${donation.charityAction}`,
            });

            res.status(200);
        } catch (err) {
            res.status(500);
        }
    } else {
        res.status(400);
    }
};


export const getChurchDonations = async (req, res) => {
    const userId = req.userId;
    try {
        const churches = await Church.find({
            userId
        })
        if (churches.length === 0) {
            return res.status(404).json({
                message: "No churches founds for you"
            })
        }
        const churchDonations = await Promise.all(churches.map(async (church) => {
            const donations = await Donation.find({ churchId: church._id })
            const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0)
            return {
                church: church.name,
                totalAmount,
                donations
            }
        }))
        res.status(200).json(churchDonations)
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find();
        return res.status(200).json({
            Success: true,
            donations
        })
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: "Internal Server error"
        })
    }
}