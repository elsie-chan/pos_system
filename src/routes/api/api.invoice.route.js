import express from "express";
import {ApiInvoiceController} from "../../controllers/index.js";
import validation from "../../validator/validation.route.js";
import {AuthMiddleware} from "../../middleware/index.js";
import {Roles} from "../../constants/roles.js";

const router = express.Router();

router.post('/create', validation, ApiInvoiceController.create.bind(ApiInvoiceController));
router.get('/get_all', AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, ApiInvoiceController.findAll.bind(ApiInvoiceController));
router.get('/get', AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, ApiInvoiceController.get.bind(ApiInvoiceController));
router.put('/update', AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, ApiInvoiceController.update.bind(ApiInvoiceController));
router.delete('/delete/:id', AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, ApiInvoiceController.delete.bind(ApiInvoiceController));
router.delete('/delete_all', AuthMiddleware.requireRole([Roles.ADMIN]), validation, ApiInvoiceController.deleteAll.bind(ApiInvoiceController));
router.post('/get_invoice_by_account/:id', validation, ApiInvoiceController.getInvoiceByAccountId.bind(ApiInvoiceController));
router.post('/get_invoice_by_customer/:id', validation, ApiInvoiceController.getInvoiceByCustomerId.bind(ApiInvoiceController));
export default router;