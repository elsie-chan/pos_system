import express from "express";
import {AuthMiddleware} from "../../middleware/index.js";
import {Roles} from "../../constants/roles.js";
import {validation} from "../../validator/index.js";
import {ApiStatisticController} from "../../controllers/index.js";

const router = express.Router();

// router.get("/today", AuthMiddleware.requireRole([Roles.ADMIN]), validation, ApiStatisticController.getToday.bind(ApiStatisticController));
// router.get("/yesterday", AuthMiddleware.requireRole([Roles.ADMIN]), validation, ApiStatisticController.getYesterday.bind(ApiStatisticController));
router.get("/get_statistics/:value", validation, ApiStatisticController.getStatistics.bind(ApiStatisticController));
router.get("/filter_invoice", AuthMiddleware.requireRole([Roles.ADMIN]), validation, ApiStatisticController.filterInvoice.bind(ApiStatisticController));
export default router;