import jwt from "jsonwebtoken";
import {variables} from "../configuration/index.js";
const verifyToken = ( token ) => {
    return new Promise( ( resolve, reject ) => {
        jwt.verify( token, variables.JWT_ACCESS, ( err, decoded ) => {
            if (err) {
                return reject( err );
            }

            return resolve( decoded );
        } );
    } )
}

const verifyRefreshToken = ( token ) => {
    return new Promise( ( resolve, reject ) => {
        jwt.verify( token, variables.JWT_REFRESH, ( err, decoded ) => {
            if (err) {
                return reject( err );
            }

            return resolve( decoded );
        } );
    } )
}


export {verifyToken, verifyRefreshToken};