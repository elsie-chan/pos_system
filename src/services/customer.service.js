import Customer, {findCustomer} from "../models/customer.model.js";
import {ErrorMessage} from "../errors/index.js";

async function create(data) {
    try {
        const newCustomer = new Customer({
            ...data
        });
        await newCustomer.save();
        return newCustomer;
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

async function find(data) {
    try {
        const customer = await Customer.find(data)
        if (customer) {
            return customer;
        } else {
            return null
        }
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }

}

async function update(data) {
    try {
        const customer = await Customer.findOneAndUpdate({
            _id: data._id
        }, {
            $push: {
                invoices: {
                    $each: [data.invoices],
                    $position: 0
                }
            }
        }, {
            new: true
        })
        if (customer) {
            return customer;
        } else {
            return null
        }
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

export default {create, find, update}