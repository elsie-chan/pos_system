import express from "express";
import {ApiAccountController} from "../../controllers/index.js";
import {AuthMiddleware, IsLocked} from "../../middleware/index.js";
import {Roles} from "../../constants/roles.js";
import {validation} from "../../validator/index.js";
import {configUpload} from "../../configuration/index.js";

const router = express.Router();

router.delete("/delete_all", validation, AuthMiddleware.requireRole([Roles.ADMIN]), ApiAccountController.deleteAll.bind(ApiAccountController));
router.post("/find", validation, ApiAccountController.find.bind(ApiAccountController));
router.get("/get_one", validation, ApiAccountController.getOne.bind(ApiAccountController));
router.get("/find_all", validation, AuthMiddleware.requireRole([Roles.ADMIN]), ApiAccountController.getAll.bind(ApiAccountController));
router.delete("/delete/:id", validation, AuthMiddleware.requireRole([Roles.ADMIN]), ApiAccountController.delete.bind(ApiAccountController));
router.put("/update/:id", validation, AuthMiddleware.requireRole([Roles.ADMIN]), ApiAccountController.update.bind(ApiAccountController));
router.put("/update_avatar", validation, configUpload("avatars").array('avatar', 12), ApiAccountController.updateAvatar.bind(ApiAccountController) )
router.post("/lock/:id", validation, ApiAccountController.lockAccount.bind(ApiAccountController));
router.put("/update_avatar/:id", validation, AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), configUpload("avatars").array('avatar', 12), ApiAccountController.updateAvatar.bind(ApiAccountController) )
router.post("/lock/:id", validation, AuthMiddleware.requireRole([Roles.ADMIN]), ApiAccountController.lockAccount.bind(ApiAccountController));
export default router;