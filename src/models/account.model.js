import mongoose from "mongoose";
import validator from "validator";
import {AccountError, ErrorMessage} from "../errors/index.js";
import {Roles} from "../contants/roles.js";
import {generateToken, generateRefreshToken, verifyToken, verifyRefreshToken} from "../middleware/index.js"
import bcrypt from "bcrypt";

const accountSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true,
        validate: (value) => {
            if (!validator.isAlphanumeric(value)) throw new AccountError('Invalid username');
        }
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true,
        validate: (value) => {
            if (!validator.isEmail(value)) throw new AccountError('Invalid email address');
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: (value) => {
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
    logging: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String
    },
    refreshToken: {
        type: String
    },
    invoices: [{type: mongoose.Schema.Types.ObjectId, ref: "Invoice"}],
}, {timestamps: true});

const Account = mongoose.model("Account", accountSchema);

export default Account;

export const verifyAccount = async (data) => {
    try {
        const existAccount = await Account.findOne({
            username: data.username
        });

        if (!existAccount) {
            // status for exist data
            return ErrorMessage(400, "Account not found");
        }

        if (!existAccount.active) {
            return ErrorMessage(400, "Please login by clicking on the link in your email");
        }

        const isMatch = await bcrypt.compare(data.password.trim(), existAccount.password.trim());
        if (!isMatch) {
            return ErrorMessage(400, "Invalid credentials");
        }

        const token = existAccount.token;

        const decodedToken = await verifyToken(token).then((data) => data).catch((e) => null)
        //     check if token is not expired then return it token or else check if refresh token is not expired then return new token
        if (decodedToken && decodedToken.exp > Date.now() / 1000) {
            console.log("token is not expired");
            return existAccount;
        } else {
            console.log("token is expired");
            const newRefreshToken = await generateRefreshToken(data);
            const decodedRefreshToken = await verifyRefreshToken(newRefreshToken);
            if (!decodedRefreshToken) {
                return ErrorMessage(400, "Invalid refresh token");
            }

            if (decodedRefreshToken.exp > Date.now() / 1000) {
                console.log("refresh token is not expired and generate new token");
                const newToken = await generateToken(data);
                const newRefreshToken = await generateRefreshToken(data);
                existAccount.refreshToken = newRefreshToken;
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

export const findAccount = async (id) => {
    try {
        const existAccount = await Account.findOne({
            _id: id
        });

        if (!existAccount) {
            // status for exist data
            return ErrorMessage(400, "Account not found");
        }

        return existAccount;
    } catch (e) {
        console.log(e);
        return ErrorMessage(500, "Server errors", e);
    }
}

export const isCheckAccount = async (id) => {
    try {
        const existAccount = await Account.findOne({
            _id: id
        });

        if (!existAccount) {
            // status for exist data
            return false
        }

        if (existAccount.logging) {
            return true;
        }
    } catch (e) {
        console.log(e);
        return ErrorMessage(500, "Server errors", e);
    }
}