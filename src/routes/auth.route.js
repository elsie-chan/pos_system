import express from "express";
import {AuthController} from "../controllers/index.js";
import validation from "../validator/validation.route.js";


const router = express.Router();

router.get("/login", validation, AuthController.login.bind(AuthController));

router.get("/change_password", validation, AuthController.changePassword.bind(AuthController));


export default router;