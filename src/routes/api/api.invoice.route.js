import express from "express";
import {ApiInvoiceController} from "../../controllers/index.js";
import validation from "../../validator/validation.route.js";

const router = express.Router();

router.post('/create', validation, ApiInvoiceController.create.bind(ApiInvoiceController));
export default router;