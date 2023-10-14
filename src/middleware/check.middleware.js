import {Roles} from "../constants/roles.js";

const requireCookie = (req, res, next) => {

    if (req.cookies.role != Roles.ADMIN) {
        return res.status(403).render('error/403');
    }
    next();
}

export default {requireCookie};