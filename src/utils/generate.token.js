import jwt from 'jsonwebtoken';
import {variables} from '../configuration/index.js'

const generateToken = (data) => {
    console.log("data", data)
    console.log("JWT_ACCESS", variables.JWT_ACCESS);
    return new Promise((resolve, reject) => {
        jwt.sign({
                id: data._id,
                username: data.username,
                role: data.role,
            },
            variables.JWT_ACCESS,
            {expiresIn: variables.JWT_ACCESS_EXPIRES, algorithm: "HS256",},
            (err, token) => {
                if (err) {
                    return reject(err);
                }
                return resolve(token);
            }
        );
    })
}

const generateRefreshToken = (data) => {
    console.log("data", data);
    return new Promise((resolve, reject) => {
        jwt.sign({
                id: data._id,
                username: data.username,
                role: data.role,
            },
            variables.JWT_REFRESH,
            {expiresIn: variables.JWT_REFRESH_EXPIRES, algorithm: "HS256",},
            (err, token) => {
                if (err) {
                    return reject(err);
                }
                return resolve(token);
            }
        );
    })
}

const genarateTokenForActive = (data) => {
    console.log("data", data)
    console.log("JWT_ACCESS", variables.JWT_ACCESS);
    return new Promise((resolve, reject) => {
        jwt.sign({
                id: data._id,
                username: data.username,
                role: data.role,
            },
            variables.JWT_ACCESS,
            {expiresIn: variables.JWT_TOKEN_ACTIVE, algorithm: "HS256",},
            (err, token) => {
                if (err) {
                    return reject(err);
                }
                return resolve(token);
            }
        );
    })
}

export {generateToken, generateRefreshToken, genarateTokenForActive};
