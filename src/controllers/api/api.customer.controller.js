import {CustomerService} from "../../services/index.js";

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
}

export default new ApiCustomerController();