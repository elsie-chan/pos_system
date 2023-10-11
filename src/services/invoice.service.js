import Invoice, {findInvoice} from "../models/invoice.model.js";
import {ErrorMessage} from "../errors/index.js";

const createInvoice = async (data) => {
    try {
        const newInvoice = new Invoice(
            ...data,
        );
        await newInvoice.save();
        return newInvoice;
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

export default {createInvoice}