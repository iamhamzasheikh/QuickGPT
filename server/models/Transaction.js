import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", required: true
    },

    planId: {
        type: String, required: true
    },

    amount: {
        type: Number,
        required: true
    },

    credits: {
        type: Number,
        required: true,
    },

    isPaid: {
        type: Boolean,
        default: false
    },

    userName: {
        type: String,
        required: true,
    },

    userEmail: {
        type: String,
        required: true,
    },

    totalCreditsAfterPurchase: {
        type: Number,
        default: 0, // will be updated after payment succeeds
    },

}, { timestamps: true })

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;