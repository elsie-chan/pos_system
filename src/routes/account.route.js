import express from "express";
import ApiAccountController from "../controllers/api/api.account.controller.js";

const router = express.Router();

router.delete("/delete_all", ApiAccountController.deleteAll.bind(ApiAccountController));

export default router;