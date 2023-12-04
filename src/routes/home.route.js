import express from "express";
import {configUpload} from "../configuration/index.js";
import {SellController} from "../controllers/index.js";
import {validation, rememberMe} from "../validator/index.js";
import {AuthMiddleware} from "../middleware/index.js";
import {Roles} from "../constants/roles.js";
import ApiProductController from "../controllers/api/api.product.controller.js";

const router = express.Router();


router.get("/reset", (req, res) => {
    res.render('layouts/auth/reset', {title: 'Reset Password'})
});
router.get("/add_product_to_session", AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, SellController.addProductToSession.bind(SellController));

router.get("/",  rememberMe, validation, async ( req, res ) => {
    let products = await ApiProductController.getAll(req, res);
    //console.log(products)
    res.render('layouts/home', {title: 'Home', products: products.data, pagination: products.pagination});
})

export default router;