import express from "express";
import validation from "../../validator/validation.route.js";
import {AuthMiddleware} from "../../middleware/index.js";
import {Roles} from "../../constants/roles.js";
import {ApiCustomerController} from "../../controllers/index.js";

const router = express.Router();

router.post("/create", validation, ApiCustomerController.create.bind(ApiCustomerController));
router.get("/get_all", AuthMiddleware.requireRole([Roles.ADMIN]), validation, ApiCustomerController.getAll.bind(ApiCustomerController));
router.post("/get", validation, ApiCustomerController.find.bind(ApiCustomerController));
router.delete("/delete/:id", validation, ApiCustomerController.deleteCustomer.bind(ApiCustomerController));
router.put("/update/:phone", validation, ApiCustomerController.update.bind(ApiCustomerController));
export default router;