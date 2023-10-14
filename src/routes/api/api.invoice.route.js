import express from "express";
import {ApiInvoiceController} from "../../controllers/index.js";
import validation from "../../validator/validation.route.js";
import {AuthMiddleware} from "../../middleware/index.js";
import {Roles} from "../../constants/roles.js";

const router = express.Router();

router.post('/create',  AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, ApiInvoiceController.create.bind(ApiInvoiceController));
router.get('/get_all', AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, ApiInvoiceController.findAll.bind(ApiInvoiceController));
export default router;