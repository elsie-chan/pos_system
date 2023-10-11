import express from "express";
import {ApiAccountController} from "../../controllers/index.js";
import {AuthMiddleware} from "../../middleware/index.js";
import {Roles} from "../../constants/roles.js";
import validation from "../../validator/validation.route.js";
import {configUpload} from "../../configuration/index.js";

const router = express.Router();

router.delete("/delete_all", validation, AuthMiddleware.requireRole([Roles.ADMIN]), ApiAccountController.deleteAll.bind(ApiAccountController));
router.get("/find", validation, AuthMiddleware.requireRole([Roles.ADMIN]), ApiAccountController.find.bind(ApiAccountController));
router.get("/find_all", validation, AuthMiddleware.requireRole([Roles.ADMIN]), ApiAccountController.findAll.bind(ApiAccountController));
router.delete("/delete/:id", validation, AuthMiddleware.requireRole([Roles.ADMIN]), ApiAccountController.delete.bind(ApiAccountController));
router.put("/update/:id", validation, AuthMiddleware.requireRole([Roles.ADMIN]), ApiAccountController.update.bind(ApiAccountController));
router.put("/update_avatar/:id", validation, configUpload("avatars").array('avatar', 12), ApiAccountController.updateAvatar.bind(ApiAccountController) )
export default router;