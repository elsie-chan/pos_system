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

router.get("/upload", configUpload('products').array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})

router.get("/add_product_to_session", AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, SellController.addProductToSession.bind(SellController));

export default router;