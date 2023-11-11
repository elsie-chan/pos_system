import Invoice from "../models/invoice.model.js";
import {ErrorMessage} from "../errors/index.js";
import {AccountService} from "./index.js";
import dayjs from "dayjs";

async function getToday() {
    try {
        const invoices = await Invoice.find({
            datePurchase: dayjs(new Date()).format("DD/MM/YYYY")
        })
        if (invoices == null) {
            return null
        }
        console.log(invoices)
        return {
            totalInvoice: invoices.reduce((acc, cur) => acc + 1, 0),
            totalAccount: invoices.reduce((acc, cur) => acc + cur.accounts.length, 0),
            totalProduct: invoices.reduce((acc, cur) => acc + cur.products.length, 0),
            totalCustomer: invoices.reduce((acc, cur) => acc + cur.customers.length, 0),
            totalMoney: invoices.reduce((acc, cur) => acc + cur.total, 0)
        };
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

export default { getToday }