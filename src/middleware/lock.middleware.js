import {isLockAccount} from "../models/account.model.js";

const isLocked = async (req, res, next) => {
    const id = req.session.accounts.find(account => account._id === req.params.id)[0]._id;
    if (await isLockAccount(id)) {
        req.session.accounts = req.session.accounts.filter(account => account._id !== id);
        req.session.save();
        req.session.destroy();
        res.clearCookie("refreshToken");
        res.clearCookie("role");
        return res.status(403).render('error/error', {title: 403, error: "403", message: "Forbidden"})
    } else {
        next();
    }
}

export default {isLocked};