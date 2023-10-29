const requireRole = ( roles ) => {
    if (!roles) {
        throw new Error("Role is required");
    }

    return async ( req, res, next ) => {
        if (!Array.isArray(roles)) {
            let role;
            role = [roles];
        }
        console.log(req.cookies)

        const accountRole = req.cookies.role;

        console.log(roles)

        if (!roles.includes(accountRole)) {
            return res.status(403).render('error/error', {title: 403, error: "403", message: "Forbidden"})
        }
        next();
    }
}

export default {
    requireRole
};