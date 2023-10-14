import mongoose from "mongoose";
import {ErrorMessage} from "../errors/index.js";

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
    paymentMethod: {
        type: String,
        required: true,
        default: "cash",
    },
    datePurchase: {
        type: Date,
        required: true,
    },
    products: {
        type: Array,
    },
    account: {
        type: Array
    },
    customer: {
        type: Array
    },
}, {timestamps: true});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;

export const findInvoice = async (data) => {
    try {
        const invoice = await Invoice.findOne({
            $where: data,
        })
        if (!invoice) {
            return ErrorMessage(400, "Invoice not found");
        }
        return invoice;
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}