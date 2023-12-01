import express from "express";
import {AuthMiddleware} from "../../middleware/index.js";
import {Roles} from "../../constants/roles.js";
import validation from "../../validator/validation.route.js";
import {ApiStatisticController} from "../../controllers/index.js";

const router = express.Router();

router.get("/today", AuthMiddleware.requireRole([Roles.ADMIN]), validation, ApiStatisticController.getToday.bind(ApiStatisticController));

export default router;