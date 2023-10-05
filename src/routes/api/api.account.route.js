import express from "express";
import {ApiAccountController} from "../../controllers/index.js";
import {AuthMiddleware} from "../../middleware/index.js";
import {Roles} from "../../contants/roles.js";

const router = express.Router();

router.delete("/delete_all", AuthMiddleware.requireRole([Roles.ADMIN]), ApiAccountController.deleteAll.bind(ApiAccountController));

export default router;