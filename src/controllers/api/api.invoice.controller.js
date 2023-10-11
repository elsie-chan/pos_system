import {InvoiceService} from "../../services/index.js";

class ApiInvoiceController {
    async create(req, res) {
        try {
            const newInvoice = await InvoiceService.createInvoice(req.body);
            console.log(newInvoice)
            return res.status(200).json({ message: 'Create invoice successfully'})
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }
}

export default new ApiInvoiceController()