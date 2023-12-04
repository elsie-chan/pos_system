import {AuthService} from "../../services/index.js";
import Account, {findAccount} from "../../models/account.model.js";
import mailService from "../../services/mail.service.js";
import {variables} from "../../configuration/index.js";


class ApiAuthController {
    async create(req, res) {

        const account = await AuthService.createAccount(req.body);
        if (account == null) {
            return res.status(400).send({error: "Account already exist"});
        }
        await mailService.sendMail({
            email: account.email,
            subject: "Phone Store - Active account",
            template: "notification_new_account",
            context: {
                name: account.name,
                email: account.email,
                url: `${variables.URL}:${variables.PORT}/api/v1/auth/validate/${generateToken()}?email=${account.email}`,
            }
        });
        return res.status(200).json(account);
    }

    async authenticate(req, res) {
            const data = {
                username: req.query.username,
                password: req.query.password
            }
        const signIn = await AuthService.authenticate(data);
        switch (signIn.status) {
            case 400: {
                return res.status(400).render('error/error', {title: 400, error: "400", message: "BAD REQUEST"})
            }
            case 500: {
                return res.status(500).render('error/error', {title: 500, error: "500", message: "INTERNAL SERVER ERROR"})
            }
            default: {
                req.session.accounts = req.session?.accounts || [];
                //     check if user already exist in session
                const account = req.session.accounts.find(account => account._id === signIn._id);
                if (!account) {
                    req.session.accounts.push({
                        _id: signIn._id,
                        email: signIn.email,
                        token: signIn.token,
                        role: signIn.role,
                    });
                }
                req.session.save();

                res.cookie("refreshToken", signIn.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    sameSite: "strict"
                })
                return res.redirect('/auth/change_password/' + signIn._id + '&token=' + signIn.token);
            }
        }
    }

    async logout(req, res) {
        const id = req.user.id
        console.log("id", id)
        const account = await findAccount(id);
        if (account.message) {
            return res.status(400).json({errors: "Account not found"});
        }
        if (!req.session.accounts) {
            return req.session.accounts = []
        }

        req.session.accounts = req.session.accounts.filter(account => account._id !== id);
        req.session.save();
        req.session.destroy();
        res.clearCookie("refreshToken");
        return res.status(200).json({message: "Logout success"});
    }

    async resendMail(req, res) {
        const account = await Account.findOne({email: req.body.email});
        try {
            await mailService.sendMail({
                email: account.email,
                subject: "Phone Store - Reactive account",
                template: "notification_new_account",
                context: {
                    name: account.fullname,
                    email: account.email,
                    url: `${variables.URL}:${variables.PORT}/api/v1/auth/validate/${generateToken()}?email=${account.email}`,
                }
            });
            return res.status(200).json({message: "Send mail success"});
        } catch (e) {
            console.log(e);
            return res.status(500).json({errors: "Server errors"});
        }
    }

    async validate(req, res) {
        const {token} = req.params;
        // Check if the token exists and is still valid.
        if (tokenMap.has(token) && tokenMap.get(token) > Date.now()) {
            console.log('Valid token.');
            res.redirect('/api/v1/auth/active?email=' + req.query.email + '&success_redirect=auth/change_password/&failure_redirect=auth/failed_active?code=' + token);
        } else {
            res.clearCookie("refreshToken");
            res.clearCookie("role");
            req.session.destroy();
            console.log('Invalid token.');
            res.redirect('/auth/failed_active?code=' + token + '&success_redirect=auth/change_password&failure_redirect=auth/failed_active?code=' + token);
        }
    }

    async setActive(req, res) {
        const account = await AuthService.setActive(req.query.email);
        if (account == null) {
            return res.status(400).json({errors: "Account not found"});
        }
        res.redirect(`/api/v1/auth/verify_account?username=${account.username}&password=${account.username}&success_redirect=auth/change_password/${account._id}&failure_redirect=auth/failed_active`);
    }

    async resetPassword(req, res) {
        const account = await  AuthService.resetPassword(req.params.id, req.body);
        if (account == null) {
            return res.status(400).json({errors: "Account not found"});
        }
        if (account.message) {
            return res.status(account.status).json({errors: account.message});
        }
        return res.status(200).json(account);
    }

    async changePassword(req, res) {
        try {
            const data = {
                id: req.user.id,
                oldPassword: req.body.oldPassword,
                newPassword: req.body.newPassword,
            }
            const account = await AuthService.changePassword(data);
            if (account == null) {
                return res.status(400).json({errors: "Account not found"});
            }
            if (account.message) {
                return res.status(account.status).json({errors: account.message});
            }
            return res.status(200).json(account);
        } catch (e) {
            console.log(e)
            return res.status(500).json({errors: "Server errors"});
        }
    }
}

const tokenMap = new Map();

function generateToken() {
    const token = Math.random().toString(36).substring(7);
    const expirationTime = Date.now() + 60000; // 1 minute from now
    tokenMap.set(token, expirationTime);
    return token;
}

export default new ApiAuthController();