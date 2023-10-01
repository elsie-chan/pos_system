import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    total: {
        type: Number,
        required: true,
    },
    take: {
        type: Number,
        required: true,
    },
    change: {
        type: Number,
    },
    productQuantity: {
        type: Number,
        required: true,
    },
    datePurchase: {
        type: Date,
        required: true,
    },
    products: {
        type: Array,
    },
    accountId: {type: mongoose.Schema.Types.ObjectId, ref: "Account"},
    customerId: {type: mongoose.Schema.Types.ObjectId, ref: "Customer"},
}, {timestamps: true});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;