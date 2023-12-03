import express from "express";
import {configUpload} from "../configuration/index.js";
import {SellController} from "../controllers/index.js";
import validation from "../validator/validation.route.js";
import {AuthMiddleware} from "../middleware/index.js";
import {Roles} from "../constants/roles.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render('layouts/home', {title: 'Home'})
});
router.get("/reset", (req, res) => {
    res.render('layouts/auth/reset', {title: 'Reset Password'})
});
router.get("/add_product_to_session", AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, SellController.addProductToSession.bind(SellController));

export default router;