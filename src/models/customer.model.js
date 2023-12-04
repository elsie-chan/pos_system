import mongoose from "mongoose";
import {AccountError, ErrorMessage} from "../errors/index.js";
import validator from "validator";

const customerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                if (!validator.isMobilePhone(value)) throw new Error('Invalid phone number');
            }
        }
    },
    address: {
        type: String,
        required: true,
    },
    invoices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice"
    }],
}, {timestamps: true});

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