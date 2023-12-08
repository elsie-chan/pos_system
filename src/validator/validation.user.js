import passport from "passport";
import {ErrorMessage} from "../errors/index.js";

const rememberMe = async (req, res, next) => {
    try {
        const remember = req.cookies['remember'];

        if (!remember || remember === 'false') {
            return next();
        }
        console.log("remember", remember)
        //     authentication with passport jwt strategy
        await passport.authenticate('jwt', { session: true }, async ( err, user, info ) => {
            if (err) {
                console.log("err", err)
                return next(err);
            }

            if (info) {
                console.log("validate info", info)
                return next();
            }

            if (!user) {
                return next(
                    ErrorMessage(401, "Unauthorized", "You are not authorized to access this resource")
                );
            }
            console.log("user", user);

            req.logIn(user, async function (err) {
                if (err) {
                    console.log("validation user err", err)
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
                console.log(req.session)
                next();
            })
        })(req, res, next);
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: e.message})
    }
}

export default rememberMe;