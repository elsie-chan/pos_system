import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    invoices: {
        type: Array,
        default: [],
    },
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;