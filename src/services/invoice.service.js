import Invoice from "../models/invoice.model.js";
import {ErrorMessage} from "../errors/index.js";
import {AccountService, CustomerService} from "./index.js";

const createInvoice = async (data) => {
    try {
        let quantity = 0;
        let total = 0;
        data.products.forEach((product) => {
            total += product.retailPrice * product.quantity;
            quantity += product.quantity;
        })

        const newInvoice = new Invoice({
            ...data,
            total: total,
            change: data.take - total ? data.take - total : 0,
            productQuantity: quantity,
            datePurchase: new Date(),
            products: data.products,
            account: data.accounts,
            customer: data.customer,
        });
        await newInvoice.save();
        await CustomerService.update({
            _id: data.customer._id,
            invoices: newInvoice
        });
        await AccountService.update({
            _id: data.accounts._id,
            invoices: newInvoice
        })
        return newInvoice;
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

async function findAll() {
    try {
        const invoices = await Invoice.find();
        if (invoices == null) {
            return null
        }
        return invoices;
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

async function get(data) {
    try {
        const invoice = await Invoice.find(data)
        if (invoice == null) {
            return null
        }
        return invoice;

    } catch (e) {
        console.log(e)
        return ErrorMessage("500", "Server error")
    }
}

async function update(data){
    try {
        
    } catch (e) {
        
    }
} 

export default {createInvoice, findAll, get}