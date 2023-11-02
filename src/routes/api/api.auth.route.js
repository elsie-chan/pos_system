import express from "express";
import {ApiAuthController} from "../../controllers/index.js";
import validation from "../../validator/validation.route.js";
import passport from "passport";
import {AuthMiddleware} from "../../middleware/index.js";
import {Roles} from "../../constants/roles.js";
import {configUpload} from "../../configuration/index.js";

const router = express.Router();

router.post("/create", validation, ApiAuthController.create.bind(ApiAuthController));
router.post("/authenticate", validation, ApiAuthController.authenticate.bind(ApiAuthController));
router.post("/send_mail", validation, ApiAuthController.resendMail.bind(ApiAuthController));
router.get("/active", validation, ApiAuthController.setActive.bind(ApiAuthController));
router.post("/logout/:id", validation, ApiAuthController.logout.bind(ApiAuthController));
router.get("/verify_account", validation, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true,
        session: true
    }, ( err, user, info ) => {
        if (err) {
            return next(err);
        }

        if (info) {
            req.flash('error', info.message);
            console.log(info.message);
        }
        if (!user) {
            return res.redirect('/auth/login');
        }

        req.logIn(user, function ( err ) {
            if (err) {
                return next(err);
            }
            req.session.accounts = req.session?.accounts || [];
            const account = req.session.accounts.find(account => account._id === user._id);
            if (!account) {
                req.session.accounts.push({
                    _id: user._id,
                    email: user.email,
                    token: user.token,
                    refreshToken: user.refreshToken
                });
            }
            req.session.save();

            res.cookie("refreshToken", user.refreshToken, {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "strict"
            })
            res.cookie("role", user.role, {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "strict"
            })
            return res.redirect('/auth/change_password?id=' + user._id);
        });
    })(req, res, next);
});
router.get("/current_user", AuthMiddleware.requireRole([Roles.ADMIN]), validation, async ( req, res ) => {
    res.send(req.session);
})
router.get("/validate/:token", validation, ApiAuthController.validate.bind(ApiAuthController));
router.post("/reset_password/:id", validation, ApiAuthController.resetPassword.bind(ApiAuthController));

export default router;