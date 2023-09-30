import express from "express";
import ApiAuthController from "../controllers/api/api.auth.controller.js";

const router = express.Router();

router.post("/authenticate", ApiAuthController.authenticate.bind(ApiAuthController));

export default router;