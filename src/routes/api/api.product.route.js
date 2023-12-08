import express from "express";
import ApiProductController from "../../controllers/api/api.product.controller.js";
import {validation} from "../../validator/index.js";
import {configUpload} from "../../configuration/index.js";
import {AuthMiddleware} from "../../middleware/index.js";
import {Roles} from "../../constants/roles.js";

const router = express.Router();

router.get("/get_all", validation, AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), ApiProductController.getAll.bind(ApiProductController));
router.get("/get/:id", validation, AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), ApiProductController.getById.bind(ApiProductController));
router.post("/find", validation, AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), ApiProductController.findProduct.bind(ApiProductController));
router.post("/create", validation, AuthMiddleware.requireRole([Roles.ADMIN]), configUpload('products').array('image', 12), ApiProductController.create.bind(ApiProductController));
router.put("/update/:id", validation, AuthMiddleware.requireRole([Roles.ADMIN]), configUpload('products').array('image', 12), ApiProductController.update.bind(ApiProductController));
router.delete("/delete/:id", validation, AuthMiddleware.requireRole([Roles.ADMIN]), ApiProductController.delete.bind(ApiProductController));
export default router;