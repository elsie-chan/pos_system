import express from "express";
import validation from "../../validator/validation.route.js";
import {AuthMiddleware} from "../../middleware/index.js";
import {Roles} from "../../constants/roles.js";
import {ApiCustomerController} from "../../controllers/index.js";

const router = express.Router();

router.post("/create", AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, ApiCustomerController.create.bind(ApiCustomerController));
router.get("/get_all", AuthMiddleware.requireRole([Roles.ADMIN]), validation, ApiCustomerController.getAll.bind(ApiCustomerController));
router.get("/get", AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), validation, ApiCustomerController.find.bind(ApiCustomerController));

export default router;