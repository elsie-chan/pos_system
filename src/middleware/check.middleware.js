import {Roles} from "../constants/roles.js";

const requireCookie = (req, res, next) => {

    if (req.cookies.role != Roles.ADMIN) {
        return res.status(403).render('error/error', {title: 403, error: "403", message: "Forbidden"})
    }
    next();
}

export default {requireCookie};