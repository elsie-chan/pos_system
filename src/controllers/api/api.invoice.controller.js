import {InvoiceService} from "../../services/index.js";
import {paginate} from "../../utils/index.js";

class ApiInvoiceController {
    async create(req, res) {
        try {
            const data = {
                ...req.body,
                take: req.body.take,
                products: req.session.products,
                accounts: {_id: req.session.accounts[0]._id, email: req.session.accounts[0].email},
            }
            const newInvoice = await InvoiceService.createInvoice(data);
            req.session.products = []
            req.session.save()
            return res.status(200).json(newInvoice);
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }

    async findAll(req, res) {
        try {
            const page = req.query.page || 1
            const invoices = await InvoiceService.findAll();
            if (invoices == null) {
                return res.status(400).json({ message: "Invoices not found" })
            }
            return paginate(invoices, page, 10)
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }

    async get(req, res) {
        const { id } = req.params;
        try {
            const invoice = await InvoiceService.get(id);
            if (invoice == null) {
                return res.status(400).json({ message: "Invoice not found" })
            }
            return res.status(200).json(invoice);
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }

    async update(req, res) {
        const { id } = req.params;
        try {
            await InvoiceService.update(id, req.body);
            return res.status(200).json({ message: 'Update invoice successfully'})
        } catch(e){
            return res.status(500).json({ message: e.message })
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        try {
            const invoice = await InvoiceService.deleteInvoice(id);
            switch (invoice.status) {
                case 400: return res.status(400).json({ message: invoice.message })
                case 500: return res.status(500).json({ message: invoice.message })
                default: return res.status(200).json({ message: invoice })
            }
        } catch(e){
            return res.status(500).json({ message: e.message })
        }
    }

    async deleteAll(req, res) {
        try {
            const invoice = await InvoiceService.deleteAll();
            switch (invoice.status) {
                case 400: return res.status(400).json({ message: invoice.message })
                case 500: return res.status(500).json({ message: invoice.message })
                default: return res.status(200).json({ message: invoice })
            }
        } catch(e){
            return res.status(500).json({ message: e.message })
        }
    }
}

export default new ApiInvoiceController()