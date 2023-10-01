import jwt from 'jsonwebtoken';
import {variables} from '../configuration/index.js'

const generateToken = (data) => {
    return jwt.sign({
            id: data._id,
            email: data.email,
            role: data.role,
        },
        variables.JWT_ACCESS,
        {expiresIn: variables.JWT_ACCESS_EXPIRES,  algorithm: "HS256",});
}

const generateRefreshToken = (data) => {
    return jwt.sign({
            id: data._id,
            email: data.email,
            role: data.role,
        },
        variables.JWT_REFRESH,
        {expiresIn: variables.JWT_REFRESH_EXPIRES,  algorithm: "HS256",});
}

export {generateToken, generateRefreshToken};
