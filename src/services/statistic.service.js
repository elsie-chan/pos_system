import Invoice from "../models/invoice.model.js";
import {ErrorMessage} from "../errors/index.js";

async function getToday() {
    try {
        const date = new Date();

        const invoices = await Invoice.find({
            datePurchase: date
        })
        if (invoices == null) {
            return null
        }
        return invoices;
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

export default { getToday }