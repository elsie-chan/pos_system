import {CustomerService} from "../../services/index.js";
import {paginate} from "../../utils/index.js";

class ApiCustomerController {
    async create(req, res) {
        try {
            const customer = await CustomerService.create(req.body);
            return res.status(200).json(customer);
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                message: "Server errors",
            });
        }
    }

    async find(req, res) {
        try {
            const data = req.body;
            const customer = await CustomerService.find(data);
            if (!customer) {
                return res.status(400).json({
                    message: "Customer not found",
                });
            }
            return res.status(200).json(customer);
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Server errors",
            });
        }
    }

    async getAll(req, res) {
        try {
            let page = req.query.page || 1;
            const customers = await CustomerService.getAll();
            if (!customers) {
                return res.status(400).json({
                    message: "Customers not found",
                });
            }
            return paginate(customers, page, 10)
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Server errors",
            });
        }
    }

    async update(req, res) {
        try {
            const phone = req.params.phone
            const data = {data: req.body, phone: phone};
            const customer = await CustomerService.updateCustomer(data);
            if (customer == null) {
                return res.status(400).json({message: "Customer not found"})
            }
            return res.status(200).json(customer)
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Server errors",
            });
        }
    }

    async deleteCustomer(req, res) {
        try {
            const id = req.params.id;
            const customer = await CustomerService.deleteCustomer(id);
            if (!customer) {
                return res.status(400).json({
                    message: "Customer not found",
                });
            }
            return res.status(200).json(customer);
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Server errors",
            });
        }
    }
}

export default new ApiCustomerController();