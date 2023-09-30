import jwt from "jsonwebtoken";
import variables from "../configuration/index.js";
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, variables.JWT_ACCESS, (err, user) => {
            if (err) res.status(403).json("Token is not valid");
            req.user = user;
            next();
        })
    } else {
        res.status(401).json("You are not authenticated!");
    }
}

export default verifyToken;