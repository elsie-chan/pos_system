import express from "express";
import {configUpload} from "../configuration/index.js";
import {ApiAccountController, SellController} from "../controllers/index.js";
import {validation, rememberMe} from "../validator/index.js";
import {AuthMiddleware} from "../middleware/index.js";
import {Roles} from "../constants/roles.js";
import ApiProductController from "../controllers/api/api.product.controller.js";

const router = express.Router();


router.get("/reset", (req, res) => {
    res.render('layouts/auth/reset', {title: 'Change Password'})
});
router.get("/profile", async (req, res) => {
    try {
        const account = await ApiAccountController.getOne(req);
        console.log(account);
        res.render('layouts/profile', {account: account});
    } catch (e) {
        console.log(e);
        req.flash("errors", e.message);
        if (e.message === "Account not found") {
            res.status(404).send("Account not found");
        } else {
            res.status(500).send(e.message);
        }
    }
});
router.get("/add_product_to_session", AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, SellController.addProductToSession.bind(SellController));

router.get("/",  rememberMe, validation, async ( req, res ) => {
    let products = await ApiProductController.getAll(req, res);
    //console.log(products)
    res.render('layouts/home', {title: 'Home', products: products.data, pagination: products.pagination});
})

export default router;