import Invoice from "../models/invoice.model.js";
import {ErrorMessage} from "../errors/index.js";
import {AccountService, CustomerService, ProductService} from "./index.js";
import dayjs from "dayjs";
import mongoose from "mongoose";

const createInvoice = async (data) => {
    try {
        let total = 0;
        let quantity = 0;
        let products = [];
        const date = new Date();
        if (data.products == null) {
            return ErrorMessage(400, "Product is empty");
        }
        for (let i = 0; i < data.products.length; i++) {
            const productExist = await ProductService.getById(data.products[i].id);
            if (productExist == null) {
                return ErrorMessage(400, "Product not found");
            } else {
                quantity += data.products[i].quantity;
                total += productExist.retailPrice * data.products[i].quantity;
                products.push({
                    products: productExist,
                    quantity: data.products[i].quantity
                })
            }
        }

        if (data.take < total) {
            return ErrorMessage(400, "Take money is not enough");
        }

        const customer = await CustomerService.find(data.customer)
        if (customer == null) {
            return ErrorMessage(400, "Customer not found");
        }
        console.log(customer)

        const newInvoice = new Invoice({
            ...data,
            total: total,
            change: data.take - total ? data.take - total : 0,
            productQuantity: quantity,
            datePurchase: dayjs(new Date()).format("DD/MM/YYYY hh:mm:ss"),
            products: products,
            account: data.accounts,
            customer: customer,
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
        return await Invoice.findByIdAndUpdate(newInvoice._id, {
            $set: {
                "customer.0.invoices": newInvoice._id,
            }
        }, {new: true});
    } catch
        (e) {
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
        console.log(data)
        const invoice = await Invoice.find({_id: data})
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
        const invoices = await Invoice.find({
            "products.products._id": new mongoose.Types.ObjectId(id)
        })
        if (invoices == null) {
            return null
        }
        return invoices;

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

async function getInvoiceByAccount(id) {
    try {
        const invoices = await Invoice.find({
            "account._id": id
        })
        if (invoices == null) {
            return null
        }
        console.log(invoices.length)
        return invoices;
    } catch (e) {
        console.log(e)
        return ErrorMessage("500", "Server error")
    }
}

async function getInvoiceByCustomer(id) {

    try {
        const objectId = new mongoose.Types.ObjectId(id);
        const invoices = await Invoice.find({
            "customer._id": objectId
        })
        if (invoices == null) {
            return null
        }
        console.log(invoices)
        return invoices;
    } catch (e) {
        console.log(e)
        return ErrorMessage("500", "Server error")
    }
}


export default {
    createInvoice,
    findAll,
    get,
    update,
    deleteInvoice,
    deleteAll,
    getInvoiceByAccount,
    getInvoiceByCustomer,
    findExistProduct
}
