import express from "express";
import ApiAuthController from "../controllers/api/api.auth.controller.js";
import validation from "../validator/validation.route.js";

const router = express.Router();

router.post("/create", validation, ApiAuthController.create.bind(ApiAuthController));
router.post("/authenticate", validation, ApiAuthController.authenticate.bind(ApiAuthController));
router.post("/send_mail", validation, ApiAuthController.sendMail.bind(ApiAuthController));
router.get("/active", validation, ApiAuthController.setActive.bind(ApiAuthController));
router.post("/logout/:id", ApiAuthController.logout.bind(ApiAuthController));
router.get("/current_user", async ( req, res ) => {
    res.send(req.session);
})
router.get("/validate/:token", ApiAuthController.validate.bind(ApiAuthController));
router.post("/reset_password/:id", ApiAuthController.resetPassword.bind(ApiAuthController));

export default router;