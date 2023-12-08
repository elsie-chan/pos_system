import Invoice from "../models/invoice.model.js";
import {ErrorMessage} from "../errors/index.js";
import dayjs from "dayjs";
import {checkDuplicateElementForStaff, findDuplicateElementForCustomer, findDuplicateQuantity, findDuplicatesForProduct} from "../utils/index.js";

async function getStatisticInvoice(value) {
    try {
        let revenue = 0;
        let staff = [];
        let customer = [];
        let product = [];
        let invoices = null
        switch (value) {
            case "today":
                invoices = await Invoice.find({
                    createdAt: {
                        $gte: dayjs().startOf('day').toDate(),
                        $lte: dayjs().endOf('day').toDate()
                    }
                });
                console.log("product", product)
                break;
            case "yesterday":
                console.log("case 2")
                invoices = await Invoice.find({
                    createdAt: {
                        $gte: dayjs().startOf('day').subtract(1, 'day').toDate(),
                        $lte: dayjs().endOf('day').subtract(1, 'day').toDate()
                    }
                });
                break;
            case "week":
                invoices = await Invoice.find({
                    createdAt: {
                        $gte: dayjs().subtract(7, 'day').startOf('day').toDate(),
                        $lte: dayjs().endOf('day').toDate(),
                    }
                });
                break;
            case "month":
                invoices = await Invoice.find({
                    createdAt: {
                        $gte: dayjs().startOf('month').toDate(),
                        $lte: dayjs().endOf('month').toDate()
                    }
                });
                break;
            default:
                console.log("default")
                break;
        }
        if (invoices == null) {
            return null
        } else {
            invoices.forEach(invoice => {
                revenue += invoice.total;
                staff.push(invoice.account);
                customer.push(invoice.customer);
                invoice.products.forEach(productInvoice => {
                    product.push(productInvoice.products);
                })
            })
        }
        return {
            invoices: invoices,
            revenue: revenue,
            invoiceQuantity: invoices.length,
            customerQuantity: findDuplicateElementForCustomer(customer).length,
            productQuantity: product.length,
        };
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);

    }
}


async function filterInvoiceBySpecificDate(from, to) {
    try {
        console.log("from", from)
        console.log("to", to)
        let revenue = 0;
        let staff = [];
        let customer = [];
        let product = [];
        let invoice = null
        const invoices = await Invoice.find({
            createdAt: {
                $gte: dayjs(from).startOf('day').toDate(),
                $lte: dayjs(to).endOf('day').toDate()
            }
        });
        if (invoices == null) {
            return null
        } else {
            invoices.forEach(invoice => {
                revenue += invoice.total;
                staff.push(invoice.account);
                customer.push(invoice.customer);
                invoice.products.forEach(productInvoice => {
                    product.push(productInvoice.products);
                })
            })
        }
        console.log("customer", customer)
        console.log("product", product)
        return {
            invoices: invoices,
            revenue: revenue,
            invoiceQuantity: invoices.length,
            customerQuantity: findDuplicateElementForCustomer(customer).length,
            productQuantity: product.length,
        };
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);

    }
}

export default { getStatisticInvoice, filterInvoiceBySpecificDate }