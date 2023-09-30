import mongoose from "mongoose";
import validator from "validator";
import {AccountError, ErrorMessage } from "../errors/index.js";
import { Roles } from "../contants/roles.js";
import {generateToken, generateRefreshToken, veri} from "../middleware/index.js"
import bcrypt from "bcrypt";

const accountSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true,
        validate: ( value ) => {
            if (!validator.isEmail(value)) throw new AccountError('Invalid email address');
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: ( value ) => {
            if (!validator.isStrongPassword(value)) throw new AccountError('Invalid password');
        }
    },
    role: {
        type: String,
        enum: [...Object.keys(Roles)],
        default: Roles.STAFF,
    },
    avatar: {
        type: String,
        default: null,
    },
    active: {
        type: Boolean,
        default: false,
    },
    tokens: {
        type: [String],
        default: [],
    },
    refreshToken: {
        type: [String],
        default: [],
    },
}, {timestamps: true});

const Account = mongoose.model("Account", accountSchema);

export default Account;

export const verifyAccount = async ( user ) => {
    try {
        const existAccount = await Account.findOne({
            email: user.email
        });

        if (!existAccount) {
            // status for exist user
            return ErrorMessage(400, "Account not found");
        }

        if (!existAccount.active) {
            return ErrorMessage(400, "Account is not active");
        }

        const isMatch = await bcrypt.compare(user.password.trim(), existAccount.password.trim());
        if (!isMatch) {
            return ErrorMessage(400, "Invalid credentials");
        }

        const token = existAccount.token;
        const refreshToken = existAccount.refreshToken;

        const decodedToken = await verifyToken(token).then(( data ) => data).catch(( e ) => null);

        //     check if token is not expired then return it token or else check if refresh token is not expired then return new token
        if (decodedToken && decodedToken.exp > Date.now() / 1000) {
            console.log("token is not expired");
            return existAccount;
        } else {
            console.log("token is expired");
            const decodedRefreshToken = await verifyToken(refreshToken);
            if (!decodedRefreshToken) {
                return ErrorMessage(400, "Invalid refresh token");
            }

            if (decodedRefreshToken.exp > Date.now() / 1000) {
                console.log("refresh token is not expired and generate new token");
                const newToken = await generateToken(user);
                existAccount.token = newToken;
                await existAccount.save();
                return existAccount;
            } else {
                return ErrorMessage(400, "Refresh token expired");
            }
        }
    } catch (e) {
        console.log(e);
        return ErrorMessage(500, "Server errors", e);
    }
}

export const findAccount = async ( id ) => {
    try {
        const existAccount = await Account.findOne({
            _id: id
        });

        if (!existAccount) {
            // status for exist user
            return ErrorMessage(400, "Account not found");
        }

        return existAccount;
    } catch (e) {
        console.log(e);
        return ErrorMessage(500, "Server errors", e);
    }
}