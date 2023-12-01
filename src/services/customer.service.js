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
        console.log(data)
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

async function getAll() {
    try {
        const customers = await Customer.find()
        if (customers) {
            return customers;
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
        console.log(data)
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

async function updateCustomer(data) {
    try {
        const customer = await Customer.findOneAndUpdate({
            phone: data.phone
        }, {
            $set: data.data
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

async function deleteCustomer(data) {
    try {
        const customer = await Customer.findOneAndDelete({
            _id: data,
        })
        if (customer == null) {
            return null
        }
        return customer;
    } catch (e) {
        console.log(e)
        return ErrorMessage("500", "Server error")
    }
}

async function deleteInvoiceOfCustomer(data) {
    console.log(data)
    try {
        const customer = await Customer.findByIdAndUpdate({
            _id: data.id
        }, {
            $pullAll: {
                invoices: [{
                    _id: data.invoices
                }]
            }
        })
        if (customer == null) {
            return null
        }
        return customer
    } catch (e) {
        console.log(e)
        return ErrorMessage("500", "Server error")
    }
}


export default {create, find, update, updateCustomer, deleteCustomer, getAll, deleteInvoiceOfCustomer};