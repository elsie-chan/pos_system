import express from "express";
import {configUpload} from "../configuration/index.js";
import {ApiAccountController, ApiInvoiceController, SellController} from "../controllers/index.js";
import {validation, rememberMe} from "../validator/index.js";
import {AuthMiddleware} from "../middleware/index.js";
import {Roles} from "../constants/roles.js";
import ApiProductController from "../controllers/api/api.product.controller.js";
import {StatisticService} from "../services/index.js";

const router = express.Router();

router.get("/checkout", rememberMe, async (req, res) => {
    if(req.isAuthenticated()) {
        const account = await ApiAccountController.getOne(req);
        const productsInCookie = req.cookies.products || [];
        const totalPrice = productsInCookie.reduce((total, product) => {
            return total + product.information.retailPrice * product.quantity;
        }, 0);
        console.log(productsInCookie)
        res.render('layouts/checkout', {
            title: 'Checkout',
            image: account.avatar,
            order: productsInCookie,
            total: totalPrice
        });
    } else {
        res.redirect('/auth/login');
    }
});
router.get("/reset", rememberMe, (req, res) => {
    console.log(req.session.accounts)
    res.render('layouts/auth/reset', {title: 'Change Password', role: req.session.accounts[0].role});
});
router.get("/profile", rememberMe, async (req, res) => {
    if (req.isAuthenticated()) {
        const account = await ApiAccountController.getOne(req);
        console.log(account);
        const history = await ApiInvoiceController.getHistorySell(req);
        console.log(history)
        res.render('layouts/profile', {account: account, role: req.session.accounts[0].role, history: history});
    } else {
        res.redirect('/auth/login');
    }
});
router.get("/add_product_to_session/:id", AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, SellController.addProductToSession.bind(SellController));
router.delete("/delete_product_from_session/:id", AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, SellController.deleteProduct.bind(SellController));
router.put("/update_quantity/:id", AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, SellController.updateQuantity.bind(SellController));

router.get("/", rememberMe, validation, async (req, res) => {
    if (req.isAuthenticated()) {
        const products = await ApiProductController.getAll(req, res);
        const account = await ApiAccountController.getOne(req, res);
        const productsInCookie = req.cookies.products || [];
        const totalPrice = productsInCookie.reduce((total, product) => {
            return total + product.information.retailPrice * product.quantity;
        }, 0);
        console.log(productsInCookie)
        res.render('layouts/home', {
            title: 'Home',
            products: products.data,
            pagination: products.pagination,
            image: account.avatar,
            order: productsInCookie,
            total: totalPrice
        });
    } else {
        res.redirect('/auth/login');
    }
})
router.get("/statistic", rememberMe, validation, async (req, res) => {
    const statistic = await StatisticService.getStatisticInvoice('today');
    console.log(statistic)
    res.render('layouts/statistic', {title: 'Statistic', statistic: statistic});
})

export default router;