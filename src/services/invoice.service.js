import Invoice from "../models/invoice.model.js";
import {ErrorMessage} from "../errors/index.js";
import {AccountService, CustomerService} from "./index.js";
import dayjs from "dayjs";

const createInvoice = async (data) => {
    try {
        let quantity = 0;
        let total = 0;
        const date = new Date();
        if (data.products == null) {
            return ErrorMessage(400, "Product is empty");
        }
        data.products.forEach((product) => {
            total += product.retailPrice * product.quantity;
            quantity += product.quantity;
        })

        const newInvoice = new Invoice({
            ...data,
            total: total,
            change: data.take - total ? data.take - total : 0,
            productQuantity: quantity,
            datePurchase: dayjs(new Date()).format("DD/MM/YYYY"),
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

async function findExistProduct(id) {
    try {
        const invoice = await Invoice.find({
            products: {
                $elemMatch: {
                    _id: id
                }
            }

        })
        if (invoice == null) {
            return null
        }
        return invoice;

    } catch (e) {
        console.log(e)
        return ErrorMessage("500", "Server error")
    }
}

async function update(data) {
    try {
        console.log(data)
        const invoice = await Invoice.findOneAndUpdate({
            _id: data._id,
        }, data, {new: true})
        if (invoice == null) {
            return null
        }
        console.log(invoice)
        return invoice;
    } catch (e) {
        console.log(e)
        return ErrorMessage("500", "Server error")
    }
}

async function deleteInvoice(id) {
    try {
        const invoice = await Invoice.findOne({
            _id: id,
        })
        if (invoice == null) {
            return null
        }
        const customer = invoice.customer.find((customer) => customer._id)
        const account = invoice.account.find((account) => account._id)
        const deleteInvoiceOfCustomer = await CustomerService.deleteInvoiceOfCustomer({
            id: customer._id,
            invoices: id
        })
        if (deleteInvoiceOfCustomer == null) {
            return null
        }
        const deleteInvoiceOfAccount = await AccountService.deleteInvoiceOfAccount({
            id: account._id,
            invoices: id
        })
        if (deleteInvoiceOfAccount == null) {
            return null
        }
        const deleteInvoice = await Invoice.deleteOne({
            _id: id,
        });
        if (deleteInvoice == null) {
            return null
        }
        return deleteInvoice;
    } catch (e) {
        console.log(e)
        return ErrorMessage("500", "Server error")
    }
}

async function deleteAll() {
    try {
        const invoices = await Invoice.deleteMany();
        if (invoices == null) {
            return null
        }
        return "Delete all invoices successfully";
    } catch (e) {
        console.log(e)
        return ErrorMessage("500", "Server error")
    }
}


export default {createInvoice, findAll, get, update, deleteInvoice, deleteAll, findExistProduct}