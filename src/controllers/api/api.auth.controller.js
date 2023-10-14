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

        const signIn = await AuthService.authenticate(req.body);
        switch (signIn.status) {
            case 400: {
                return res.status(400).json({error: signIn.message});
            }
            case 500: {
                return res.status(500).json({error: signIn.message});
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
                        refreshToken: signIn.refreshToken
                    });
                }
                req.session.save();

                res.cookie("refreshToken", signIn.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    sameSite: "strict"
                })
                res.cookie("role", signIn.role, {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    sameSite: "strict"
                })
                return res.status(200).json(signIn);
            }
        }
    }

    async logout(req, res) {
        const id = req.params.id
        const account = await findAccount(id);
        if (account.message) {
            return res.status(400).json({errors: "Account not found"});
        }
        if (!req.session.accounts) {
            return req.session.accounts = []
        }

        req.session.accounts = req.session.accounts.filter(account => account._id !== id);
        req.session.save();
        res.clearCookie("refreshToken");
        res.clearCookie("role");
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
            res.redirect('/api/v1/auth/active?email=' + req.query.email);
        } else {
            res.status(404).send('Link was expired. Please contact the administrator to resend another email.')
        }
    }

    async setActive(req, res) {
        const account = await AuthService.setActive(req.query.email);
        if (account == null) {
            return res.status(400).json({errors: "Account not found"});
        }
        res.redirect(`/api/v1/auth/verify_account?username=${account.username}&password=${account.username}`);
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
}

const tokenMap = new Map();

function generateToken() {
    const token = Math.random().toString(36).substring(7);
    const expirationTime = Date.now() + 60000; // 1 minute from now
    tokenMap.set(token, expirationTime);
    return token;
}

export default new ApiAuthController();