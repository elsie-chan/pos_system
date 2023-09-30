import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    accountId: {type: mongoose.Schema.Types.ObjectId, ref: "Account"},
    adminId: {type: mongoose.Schema.Types.ObjectId, ref: "Admin"},
    tokenType: {
        type: String,
        required: true,
        default: "BEARER",
    },
    expired: {
        type: Boolean,
        required: true,
        default: false,
    },
    revoked: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {timestamps: true});

const Token = mongoose.model("Token", tokenSchema);

export default Token;