import { validationResult } from "express-validator";
import {apiSuccess, apiFailure} from "../utils/api.response.js";

const validation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array()[0].msg);
        return apiFailure(res, errors.array()[0].msg);
    }
    next();
};

export default validation;