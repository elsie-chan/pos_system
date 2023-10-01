import {validationResult} from "express-validator";
import AuthServices from "../../services/auth.service.js";
import {findAccount} from "../../models/account.model.js";
import mailService from "../../services/mail.service.js";


class ApiAuthController {
    async create(req, res) {
        const validationRequest = validationResult(req);
        if (!validationRequest.isEmpty()) {
            return res.status(400).json({errors: validationRequest.array()});
        }

        const account = await AuthServices.createAccount(req.body);
        if (account == null) {
            return res.status(400).json({errors: "Account already exist"});
        }
        await mailService.sendMail(account.email, generateToken(), 'notification_new_account.ejs');
        return res.status(200).json(account);
    }
    async authenticate(req, res) {
        const validationRequest = validationResult(req);
        if (!validationRequest.isEmpty()) {
            return res.status(400).json({errors: validationRequest.array()});
        }

        const signIn = await AuthServices.authenticate(req.body);
        switch (signIn.status) {
            case 400: {
                return res.status(400).json({errors: signIn.message});
            }
            case 500: {
                return res.status(500).json({errors: signIn.message});
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
        const validationRequest = validationResult(req);
        if (!validationRequest.isEmpty()) {
            return res.status(400).json({errors: validationRequest.array()});
        }
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
        res.cookie("refreshToken", null, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "strict"
        })
        res.cookie("role", null, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "strict"
        })
        return res.status(200).json({message: "Logout success"});
    }

    async sendMail(req, res) {
        await mailService.sendMail(req.body.email, generateToken(), 'notification_new_account.ejs');
    }

    async validate(req, res) {
        const { token } = req.params;
        // Check if the token exists and is still valid.
        if (tokenMap.has(token) && tokenMap.get(token) > Date.now()) {
            console.log('Valid token.');
            res.redirect('/api/v1/auth/active?email=' + req.query.email);
        } else {
            res.status(404).send('Invalid or expired token.');
        }
    }

    async setActive(req, res) {
        const validationRequest = validationResult(req);
        if (!validationRequest.isEmpty()) {
            return res.status(400).json({errors: validationRequest.array()});
        }
        const account = await AuthServices.setActive(req.query.email);
        if (account == null) {
            return res.status(400).json({errors: "Account not found"});
        }
        res.redirect('/');
    }

    async resetPassword(req, res) {
        const validationRequest = validationResult(req);
        if (!validationRequest.isEmpty()) {
            return res.status(400).json({errors: validationRequest.array()});
        }
        const account = await AuthServices.resetPassword(req.params.id, req.body);
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