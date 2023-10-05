import mongoose from "mongoose";
import {ErrorMessage} from "../errors/index.js";

const customerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
    },
    invoices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice"
    }],
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;

export const findCustomer = async (data) => {
    try {
        const Customer = await Customer.findOne({$where: data})
        if (Customer) {
            return Customer;
        } else {
            return ErrorMessage(400, "Customer not found");
        }
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}