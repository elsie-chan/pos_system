import express from "express";
import {validation} from "../../validator/index.js";
import {AuthMiddleware} from "../../middleware/index.js";
import {Roles} from "../../constants/roles.js";
import {ApiCustomerController} from "../../controllers/index.js";

const router = express.Router();

router.post("/create", validation, AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), ApiCustomerController.create.bind(ApiCustomerController));
router.get("/get_all", AuthMiddleware.requireRole([Roles.ADMIN]), validation, ApiCustomerController.getAll.bind(ApiCustomerController));
router.post("/get", validation, AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), ApiCustomerController.find.bind(ApiCustomerController));
router.delete("/delete/:id", validation, AuthMiddleware.requireRole([Roles.ADMIN]), ApiCustomerController.deleteCustomer.bind(ApiCustomerController));
router.put("/update/:phone", AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, ApiCustomerController.update.bind(ApiCustomerController));
export default router;