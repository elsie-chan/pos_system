import express from "express";
import {ProductService, StatisticService} from "../services/index.js";
import ApiProductController from "../controllers/api/api.product.controller.js";
import {paginate} from "../utils/index.js";
import apiAccountController from "../controllers/api/api.account.controller.js";
import ApiCustomerRoute from "./api/api.customer.route.js";
import {ApiCustomerController, ApiInvoiceController, ApiStatisticController} from "../controllers/index.js";
import {rememberMe, validation} from "../validator/index.js";

const router = express.Router();

router.get("/dashboard", rememberMe, validation,  async ( req, res ) => {
    const statistic = await StatisticService.getStatisticInvoice('today');
    console.log(statistic)
    res.render('layouts/admin/dashboard', {title: 'Dashboard', statistic: statistic});
})
router.get("/product", validation, async ( req, res ) => {
    let products = await ApiProductController.getAll(req, res);
    // console.log(products)
    res.render('layouts/admin/product', {title: 'Product', products: products.data, pagination: products.pagination});
})
router.get("/account", validation, async ( req, res ) => {
    let accounts = await apiAccountController.getAll(req, res);
    res.render('layouts/admin/account', {
        title: "Account", accounts: accounts.data, pagination: accounts.pagination
    });
})
router.get("/customer", validation, async ( req, res ) => {
    let customers = await ApiCustomerController.getAll(req, res);
    res.render('layouts/admin/customer', {
        title: "Customer", customers: customers.data, pagination: customers.pagination
    });
})
router.get("/invoice", validation, async ( req, res ) => {
    let invoices = await ApiInvoiceController.findAll(req, res);
    res.render('layouts/admin/invoice', {
        title: "Invoice Management",
        invoices: invoices.data,
        pagination: invoices.pagination
    });
})

export default router;