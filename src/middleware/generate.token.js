import jwt from 'jsonwebtoken';
import {variables} from '../configuration/index.js'

const generateToken = (user) => {
    return jwt.sign({
            id: user._id,
            email: user.email,
        },
        variables.JWT_ACCESS,
        {expiresIn: variables.JWT_EXPIRES});
}

const generateRefreshToken = (user) => {
    return jwt.sign({
            id: user._id,
            email: user.email,
        },
        variables.JWT_REFRESH,
        {expiresIn: variables.JWT_EXPIRES});
}

export {generateToken, generateRefreshToken};
