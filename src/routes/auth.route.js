import express from "express";
import {AuthController} from "../controllers/index.js";
import {validation, rememberMe} from "../validator/index.js";


const router = express.Router();

router.get("/login", rememberMe, validation, AuthController.login.bind(AuthController));

router.get("/change_password/:id", validation, AuthController.changePassword.bind(AuthController));


router.get("/reset_password", validation, AuthController.resetPassword.bind(AuthController));

router.get("/failed_active", validation, ( req, res ) => {
    res.status(400).render('error/error', {
        title: 400,
        error: 400,
        message: "Link has expired. Please contact admin to help."
    })
});


export default router;