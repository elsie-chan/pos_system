import Customer, {findCustomer} from "../models/customer.model.js";
import {ErrorMessage} from "../errors/index.js";

const create = async (data) => {
    try {
        const newCustomer = new Customer(
            ...data,
        );
        await newCustomer.save();
        return newCustomer;
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

export default {create}