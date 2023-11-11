import express from "express";
import {ProductService} from "../services/index.js";
import ApiProductController from "../controllers/api/api.product.controller.js";
import {paginate} from "../utils/index.js";
import apiAccountController from "../controllers/api/api.account.controller.js";
import ApiCustomerRoute from "./api/api.customer.route.js";
import {ApiCustomerController, ApiInvoiceController} from "../controllers/index.js";

const router = express.Router();

router.get("/dashboard", ( req, res ) => {
    res.render('layouts/admin/dashboard', {title: 'Dashboard'});
})
router.get("/product", async ( req, res ) => {
    let products = await ApiProductController.getAll(req, res);
    // console.log(products)
    res.render('layouts/admin/product', {title: 'Product', products: products.data, pagination: products.pagination});
})
router.get("/account", async ( req, res ) => {
    let accounts = await apiAccountController.getAll(req, res);
    res.render('layouts/admin/account', {
        title: "Account", accounts: accounts.data, pagination: accounts.pagination
    });
})
router.get("/customer", async ( req, res ) => {
    let customers = await ApiCustomerController.getAll(req, res);
    res.render('layouts/admin/customer', {
        title: "Customer", customers: customers.data, pagination: customers.pagination
    });
})
router.get("/invoice", async ( req, res ) => {
    let invoices = await ApiInvoiceController.findAll(req, res);
    res.render('layouts/admin/invoice', {
        title: "Invoice Management",
        invoices: invoices.data
    });
})

export default router;