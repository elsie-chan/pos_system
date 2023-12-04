import express from "express";
import {ApiInvoiceController} from "../../controllers/index.js";
import {validation} from "../../validator/index.js";
import {AuthMiddleware} from "../../middleware/index.js";
import {Roles} from "../../constants/roles.js";

const router = express.Router();

router.post('/create', validation, AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), ApiInvoiceController.create.bind(ApiInvoiceController));
router.get('/get_all', AuthMiddleware.requireRole([Roles.ADMIN]), validation, ApiInvoiceController.findAll.bind(ApiInvoiceController));
router.get('/get/:id', AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, ApiInvoiceController.get.bind(ApiInvoiceController));
router.put('/update/:id', AuthMiddleware.requireRole([Roles.ADMIN]), validation, ApiInvoiceController.update.bind(ApiInvoiceController));
router.delete('/delete/:id', AuthMiddleware.requireRole([Roles.ADMIN]), validation, ApiInvoiceController.delete.bind(ApiInvoiceController));
router.delete('/delete_all', AuthMiddleware.requireRole([Roles.ADMIN]), validation, ApiInvoiceController.deleteAll.bind(ApiInvoiceController));
router.post('/get_invoice_by_account/:id', validation, AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), ApiInvoiceController.getInvoiceByAccountId.bind(ApiInvoiceController));
router.post('/get_invoice_by_customer/:id', validation, AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), ApiInvoiceController.getInvoiceByCustomerId.bind(ApiInvoiceController));
export default router;