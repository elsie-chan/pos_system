import express from "express";
import {ApiAuthController} from "../../controllers/index.js";
import {validation, rememberMe} from "../../validator/index.js";
import passport from "passport";
import {AuthMiddleware} from "../../middleware/index.js";
import {Roles} from "../../constants/roles.js";

const router = express.Router();

router.post("/create", validation, ApiAuthController.create.bind(ApiAuthController));
router.get("/verify_account", validation, ApiAuthController.authenticate.bind(ApiAuthController));
router.post("/send_mail", validation, AuthMiddleware.requireRole([Roles.ADMIN]), ApiAuthController.resendMail.bind(ApiAuthController));
router.get("/active", validation, ApiAuthController.setActive.bind(ApiAuthController));
router.get("/logout", rememberMe, validation, ApiAuthController.logout.bind(ApiAuthController));
router.post("/change_password", rememberMe, validation, AuthMiddleware.requireRole([Roles.ADMIN, Roles.STAFF]), ApiAuthController.changePassword.bind(ApiAuthController));
router.post("/authenticate", validation, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true,
        session: true
    }, ( err, user, info ) => {
        if (err) {
            return next(err);
        }


        if (info.hasOwnProperty("message")) {
            console.log("message", info.message)
            req.flash('error', info.message);
        }

        if (info.hasOwnProperty("remember")) {
            const { remember: rememberMe } = info.remember;
            if (rememberMe) {
                const token = info.remember.token;

                res.cookie('token', token, {
                    maxAge: 1000 * 60 * 24 * 7, // 7 days
                    httpOnly: true
                });

                res.cookie('remember', rememberMe, {
                    maxAge: 1000 * 60 * 24 * 7,
                    httpOnly: true
                });
            }
        }

        if (!user) {
            console.log("user", user)
            return res.redirect('/auth/login');
        }

        req.logIn(user, function ( err ) {
            console.log("user", user)
            if (err) {
                return next(err);
            }
            req.session.accounts = req.session?.accounts || [];
            const account = req.session.accounts.find(account => account._id === user._id);
            if (!account) {
                req.session.accounts.push({
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    role: user.role,
                    token: user.token,
                    refreshToken: user.refreshToken
                });
            }
            req.session.save();
            if (user.role === Roles.ADMIN) {
                return res.redirect('/admin/dashboard');
            } else {
                return res.redirect('/');
            }
        });
    })(req, res, next);
})
router.get("/current_user", validation, AuthMiddleware.requireRole([Roles.ADMIN]), async ( req, res ) => {
    res.send(req.session);
})
router.get("/validate/:token", validation, ApiAuthController.validate.bind(ApiAuthController));
router.post("/reset_password/:id", validation, ApiAuthController.resetPassword.bind(ApiAuthController));
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true,
        session: true
    }, (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (info.hasOwnProperty("message")) {
            req.flash('error', info.message);
            console.log(info.message);
        }
        if (!user) {
            return res.redirect('/auth/login');
        }

        req.logIn(user, function ( err ) {
            if (err) {
                req.flash('error', err.message);
                return next(err);
            }
            console.log("user", user)
            req.session.accounts = req.session?.accounts || [];
            const account = req.session.accounts.find(account => account._id === user._id);
            if (!account) {
                req.session.accounts.push({
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    token: user.token,
                    role: user.role,
                    refreshToken: user.refreshToken
                });
                res.cookie('token', user.token, {
                    maxAge: 1000 * 60 * 24 * 7, // 7 days
                    httpOnly: true
                });
            }
            req.session.save();
            return res.redirect('/');
        });
    })(req, res, next);
});


export default router;